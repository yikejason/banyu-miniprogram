import { buildShareUrl, encryptSnapshot, newShareSecrets, decryptSnapshot } from "./payload";
import type { ShareSnapshot } from "./types";
import { expect, test } from "vitest";

test("share url keeps key in hash", () => {
  expect(buildShareUrl("https://banyu.example", "id1", "abc")).toBe(
    "https://banyu.example/s/id1#k=abc",
  );
});

test("snapshot roundtrip", async () => {
  const { contentKey } = await newShareSecrets();
  const snap: ShareSnapshot = {
    note: "今天有点累",
    createdAt: "2026-09-14T00:00:00.000Z",
  };
  const enc = await encryptSnapshot(snap, contentKey);
  await expect(decryptSnapshot(enc, contentKey)).resolves.toEqual(snap);
});

test("refuses to pack journal body", async () => {
  const { contentKey } = await newShareSecrets();
  const snap: ShareSnapshot = {
    note: "不想被看见的话",
    createdAt: "2026-09-14T00:00:00.000Z",
  };
  await expect(
    encryptSnapshot(snap, contentKey, { forbiddenJournalBody: "不想被看见的话" }),
  ).rejects.toThrow();
});
