// Random + UUID helpers that work across mini program and web/node runtimes.

function globalScope(): Record<string, unknown> {
  if (typeof globalThis !== "undefined") return globalThis as Record<string, unknown>;
  if (typeof self !== "undefined") return self as unknown as Record<string, unknown>;
  return {} as Record<string, unknown>;
}

export function randomBytes(length: number): Uint8Array {
  const g = globalScope();
  const wx = g.wx as
    | { getRandomValues?: (opts: { length: number }) => { randomValues?: number[] } }
    | undefined;
  if (wx?.getRandomValues) {
    const { randomValues } = wx.getRandomValues({ length });
    if (randomValues) return new Uint8Array(randomValues);
  }
  const crypto = g.crypto as Crypto | undefined;
  if (crypto?.getRandomValues) return crypto.getRandomValues(new Uint8Array(length));
  // Fallback (non-crypto) — only used when no platform RNG exists.
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) out[i] = Math.floor(Math.random() * 256);
  return out;
}

export function uuid(): string {
  const b = randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
