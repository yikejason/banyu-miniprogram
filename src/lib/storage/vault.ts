import { decryptUtf8, encryptUtf8 } from "@/lib/crypto/aes";
import { fromBase64url, toBase64url } from "@/lib/crypto/bytes";
import { deriveKey } from "@/lib/crypto/key";
import { randomBytes } from "@/lib/crypto/random";
import {
  clearVaultMeta,
  deleteAllRecords,
  deleteRecordRow,
  getRecordRow,
  getVaultMeta,
  listRecordRows,
  putRecordRow,
  putVaultMeta,
  type EncryptedRecord,
  type RecordKind,
} from "@/lib/storage/db";
import { getVaultKey, isUnlocked, setVaultKey } from "@/lib/storage/session";

const VERIFIER = "banyu-vault-ok";

export async function isVaultInitialized(): Promise<boolean> {
  return Boolean(await getVaultMeta());
}

export async function createVault(passphrase: string, iterations = 310_000): Promise<void> {
  const salt = randomBytes(32);
  const key = await deriveKey(passphrase, salt, iterations);
  const verifier = await encryptUtf8(VERIFIER, key);
  await putVaultMeta({ salt: toBase64url(salt), verifier });
  setVaultKey(key);
}

export async function unlockVault(passphrase: string, iterations = 310_000): Promise<void> {
  const meta = await getVaultMeta();
  if (!meta) throw new Error("尚未设置口令");
  const key = await deriveKey(passphrase, fromBase64url(meta.salt), iterations);
  try {
    const ok = await decryptUtf8(meta.verifier, key);
    if (ok !== VERIFIER) throw new Error("口令不正确");
  } catch {
    throw new Error("口令不正确");
  }
  setVaultKey(key);
}

const DEVICE_KEY_ITERS = 10_000;

export async function ensureDeviceVault(): Promise<void> {
  if (isUnlocked()) return;
  const secret = getOrCreateDeviceSecret();
  if (!(await isVaultInitialized())) {
    await createVault(secret, DEVICE_KEY_ITERS);
    return;
  }
  try {
    await unlockVault(secret, DEVICE_KEY_ITERS);
  } catch {
    await deleteAllRecords();
    await clearVaultMeta();
    await createVault(secret, DEVICE_KEY_ITERS);
  }
}

const DEVICE_SECRET_KEY = "banyu-device-secret";

function getOrCreateDeviceSecret(): string {
  const existing = readDeviceSecret();
  if (existing && existing.length >= 24) return existing;
  const secret = toBase64url(randomBytes(32));
  writeDeviceSecret(secret);
  return secret;
}

function readDeviceSecret(): string | null {
  const g = globalThis as Record<string, unknown>;
  const wx = g.wx as
    | { getStorageSync?: (k: string) => string | undefined }
    | undefined;
  if (wx?.getStorageSync) {
    const v = wx.getStorageSync(DEVICE_SECRET_KEY);
    return v === undefined || v === "" ? null : (v as string);
  }
  if (typeof localStorage !== "undefined") return localStorage.getItem(DEVICE_SECRET_KEY);
  return null;
}

function writeDeviceSecret(secret: string): void {
  const g = globalThis as Record<string, unknown>;
  const wx = g.wx as
    | { setStorageSync?: (k: string, v: string) => void }
    | undefined;
  if (wx?.setStorageSync) {
    wx.setStorageSync(DEVICE_SECRET_KEY, secret);
    return;
  }
  if (typeof localStorage !== "undefined") localStorage.setItem(DEVICE_SECRET_KEY, secret);
}

export async function putRecord(
  kind: RecordKind,
  id: string,
  value: unknown,
): Promise<void> {
  const key = getVaultKey();
  const payload = await encryptUtf8(JSON.stringify(value), key);
  const row: EncryptedRecord = {
    id,
    kind,
    iv: payload.iv,
    ciphertext: payload.ciphertext,
    updatedAt: new Date().toISOString(),
  };
  await putRecordRow(row);
}

export async function getRecord<T>(kind: RecordKind, id: string): Promise<T | null> {
  const key = getVaultKey();
  const row = await getRecordRow(id);
  if (!row || row.kind !== kind) return null;
  return JSON.parse(await decryptUtf8(row, key)) as T;
}

export async function listRecords<T>(kind: RecordKind): Promise<T[]> {
  const key = getVaultKey();
  const rows = await listRecordRows(kind);
  const out: T[] = [];
  for (const row of rows) {
    out.push(JSON.parse(await decryptUtf8(row, key)) as T);
  }
  return out;
}

export async function deleteRecord(kind: RecordKind, id: string): Promise<void> {
  getVaultKey();
  const row = await getRecordRow(id);
  if (!row || row.kind !== kind) return;
  await deleteRecordRow(id);
}

export async function getRawRecord(id: string): Promise<EncryptedRecord | undefined> {
  return getRecordRow(id);
}
