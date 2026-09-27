import { decryptUtf8, encryptUtf8 } from "./aes";
import { fromBase64url } from "./bytes";
import { deriveKey } from "./key";
import { randomBytes } from "./random";
import { expect, test } from "vitest";

test("roundtrip encrypts and decrypts", async () => {
  const salt = fromBase64url("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  const key = await deriveKey("correct horse", salt);
  const payload = await encryptUtf8("私密日记", key);
  await expect(decryptUtf8(payload, key)).resolves.toBe("私密日记");
});

test("wrong key fails", async () => {
  const salt = randomBytes(32);
  const keyA = await deriveKey("a", salt);
  const keyB = await deriveKey("b", salt);
  const payload = await encryptUtf8("secret", keyA);
  await expect(decryptUtf8(payload, keyB)).rejects.toThrow();
});
