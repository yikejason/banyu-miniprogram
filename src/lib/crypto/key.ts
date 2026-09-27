import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";

const encoder = new TextEncoder();

// Derive a 32-byte AES-GCM key from a passphrase. Returns raw bytes (not a
// CryptoKey) so the same code works without Web Crypto.
export async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
  iterations = 310_000,
): Promise<Uint8Array> {
  return pbkdf2(sha256, encoder.encode(passphrase), salt, { c: iterations, dkLen: 32 });
}
