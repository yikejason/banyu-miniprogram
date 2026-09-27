// Base64url helpers that do not rely on btoa/atob (absent in the mini program runtime).

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function bytesToBase64(data: Uint8Array): string {
  let out = "";
  for (let i = 0; i < data.length; i += 3) {
    const b0 = data[i];
    const b1 = i + 1 < data.length ? data[i + 1] : 0;
    const b2 = i + 2 < data.length ? data[i + 2] : 0;
    const triple = (b0 << 16) | (b1 << 8) | b2;
    out += B64[(triple >> 18) & 63];
    out += B64[(triple >> 12) & 63];
    out += i + 1 < data.length ? B64[(triple >> 6) & 63] : "=";
    out += i + 2 < data.length ? B64[triple & 63] : "=";
  }
  return out;
}

export function base64ToBytes(s: string): Uint8Array {
  const clean = s.replace(/=+$/, "");
  const out: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of clean) {
    const v = B64.indexOf(ch);
    if (v === -1) continue;
    buffer = (buffer << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((buffer >> bits) & 0xff);
    }
  }
  return new Uint8Array(out);
}

export function toBase64url(data: Uint8Array): string {
  // regex replace instead of replaceAll: older mini program JSCore lacks String.replaceAll
  return bytesToBase64(data)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function fromBase64url(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  return base64ToBytes(b64);
}
