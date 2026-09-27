import { gcm } from "@noble/ciphers/aes";
import { fromBase64url, toBase64url } from "./bytes";
import { randomBytes } from "./random";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function encryptUtf8(
  plain: string,
  key: Uint8Array,
): Promise<{ iv: string; ciphertext: string }> {
  const iv = randomBytes(12);
  const cipher = gcm(key, iv);
  const ciphertext = cipher.encrypt(encoder.encode(plain));
  return { iv: toBase64url(iv), ciphertext: toBase64url(ciphertext) };
}

export async function decryptUtf8(
  payload: { iv: string; ciphertext: string },
  key: Uint8Array,
): Promise<string> {
  const iv = fromBase64url(payload.iv);
  const cipher = gcm(key, iv);
  const plain = cipher.decrypt(fromBase64url(payload.ciphertext));
  return decoder.decode(plain);
}
