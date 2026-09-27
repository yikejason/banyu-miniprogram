import { decryptUtf8, encryptUtf8 } from "@/lib/crypto/aes";
import { fromBase64url, toBase64url } from "@/lib/crypto/bytes";
import { sha256 } from "@noble/hashes/sha256";
import { randomBytes } from "@/lib/crypto/random";
import type { EncryptedShare, ShareSnapshot } from "./types";

const encoder = new TextEncoder();

export async function hashToken(token: string): Promise<string> {
  const buf = sha256(encoder.encode(token));
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function newShareSecrets(): Promise<{
  contentKey: Uint8Array;
  contentKeyParam: string;
  revokeToken: string;
}> {
  const contentKey = randomBytes(32);
  const revokeToken = toBase64url(randomBytes(32));
  return { contentKey, contentKeyParam: toBase64url(contentKey), revokeToken };
}

export function importContentKey(param: string): Uint8Array {
  return fromBase64url(param);
}

export async function encryptSnapshot(
  snapshot: ShareSnapshot,
  contentKey: Uint8Array,
  opts?: { forbiddenJournalBody?: string },
): Promise<EncryptedShare> {
  const json = JSON.stringify(snapshot);
  if (opts?.forbiddenJournalBody && json.includes(opts.forbiddenJournalBody)) {
    throw new Error("分享不能包含日记正文");
  }
  return encryptUtf8(json, contentKey);
}

export async function decryptSnapshot(
  enc: EncryptedShare,
  contentKey: Uint8Array,
): Promise<ShareSnapshot> {
  return JSON.parse(await decryptUtf8(enc, contentKey)) as ShareSnapshot;
}

// Mini program share path carries id + key as query params (no URL hash).
export function buildSharePath(id: string, contentKeyParam: string): string {
  return `/pages/share-view/index?id=${id}&k=${contentKeyParam}`;
}

// Web share URL (kept for the legacy web viewer if ever needed).
export function buildShareUrl(origin: string, id: string, contentKeyParam: string): string {
  return `${origin}/s/${id}#k=${contentKeyParam}`;
}
