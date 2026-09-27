// The vault key lives in memory for the lifetime of the app session.
let vaultKey: Uint8Array | null = null;

export function setVaultKey(key: Uint8Array | null) {
  vaultKey = key;
}

export function getVaultKey(): Uint8Array {
  if (!vaultKey) throw new Error("金库未解锁");
  return vaultKey;
}

export function isUnlocked(): boolean {
  return vaultKey !== null;
}
