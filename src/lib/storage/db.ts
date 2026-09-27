// Storage adapter: IndexedDB is unavailable in the mini program runtime, so
// records live in wx.storage (with localStorage + in-memory fallbacks for web
// and tests). The schema mirrors the previous IndexedDB shape: a meta row for
// the vault and a records map keyed by id.

export type RecordKind = "emotion" | "journal" | "temperament" | "shareLocal";

export type EncryptedRecord = {
  id: string;
  kind: RecordKind;
  iv: string;
  ciphertext: string;
  updatedAt: string;
};

export type VaultMeta = {
  salt: string;
  verifier: { iv: string; ciphertext: string };
};

const DB_NAME = "banyu";
const META_KEY = `${DB_NAME}:meta`;
const RECORDS_KEY = `${DB_NAME}:records`;

type Backend = {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
};

function globalScope(): Record<string, unknown> {
  if (typeof globalThis !== "undefined") return globalThis as Record<string, unknown>;
  if (typeof self !== "undefined") return self as unknown as Record<string, unknown>;
  return {} as Record<string, unknown>;
}

function detectBackend(): Backend {
  const g = globalScope();
  const wx = g.wx as
    | {
        getStorageSync?: (key: string) => string | undefined;
        setStorageSync?: (key: string, value: string) => void;
        removeStorageSync?: (key: string) => void;
      }
    | undefined;
  if (wx?.getStorageSync && wx.setStorageSync && wx.removeStorageSync) {
    return {
      get: (k) => {
        const v = wx.getStorageSync!(k);
        return v === undefined || v === "" ? null : (v as string);
      },
      set: (k, v) => wx.setStorageSync!(k, v),
      remove: (k) => wx.removeStorageSync!(k),
    };
  }
  const localStorage = g.localStorage as Storage | undefined;
  if (localStorage) {
    return {
      get: (k) => localStorage.getItem(k),
      set: (k, v) => localStorage.setItem(k, v),
      remove: (k) => localStorage.removeItem(k),
    };
  }
  const mem = new Map<string, string>();
  return {
    get: (k) => (mem.has(k) ? mem.get(k)! : null),
    set: (k, v) => {
      mem.set(k, v);
    },
    remove: (k) => {
      mem.delete(k);
    },
  };
}

const backend = detectBackend();

function readMeta(): VaultMeta | null {
  const raw = backend.get(META_KEY);
  return raw ? (JSON.parse(raw) as VaultMeta) : null;
}

function writeMeta(meta: VaultMeta | null): void {
  if (meta) backend.set(META_KEY, JSON.stringify(meta));
  else backend.remove(META_KEY);
}

function readRecords(): Record<string, EncryptedRecord> {
  const raw = backend.get(RECORDS_KEY);
  return raw ? (JSON.parse(raw) as Record<string, EncryptedRecord>) : {};
}

function writeRecords(records: Record<string, EncryptedRecord>): void {
  backend.set(RECORDS_KEY, JSON.stringify(records));
}

export async function getVaultMeta(): Promise<VaultMeta | null> {
  return readMeta();
}

export async function putVaultMeta(meta: VaultMeta): Promise<void> {
  writeMeta(meta);
}

export async function clearVaultMeta(): Promise<void> {
  writeMeta(null);
}

export async function putRecordRow(row: EncryptedRecord): Promise<void> {
  const records = readRecords();
  records[row.id] = row;
  writeRecords(records);
}

export async function getRecordRow(id: string): Promise<EncryptedRecord | undefined> {
  return readRecords()[id];
}

export async function listRecordRows(kind: RecordKind): Promise<EncryptedRecord[]> {
  const records = readRecords();
  return Object.values(records).filter((row) => row.kind === kind);
}

export async function deleteRecordRow(id: string): Promise<void> {
  const records = readRecords();
  delete records[id];
  writeRecords(records);
}

export async function deleteAllRecords(): Promise<void> {
  writeRecords({});
}
