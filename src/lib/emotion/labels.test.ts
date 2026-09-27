import { expect, test } from "vitest";
import { mapEmotion } from "./mapEmotion";
import { formatEmotionDate, formatEmotionLine } from "./labels";
import type { EmotionRecord } from "./types";

test("formats a local date as 年月日", () => {
  const iso = new Date(2026, 8, 17, 12).toISOString();
  expect(formatEmotionDate(iso)).toBe("2026年9月17日");
});

test("joins planet color, feeling, and date", () => {
  const createdAt = new Date(2026, 8, 17, 12).toISOString();
  const record: EmotionRecord = {
    id: "a",
    createdAt,
    input: { kind: "angry", intensity: 4 },
    visual: mapEmotion({ kind: "angry", intensity: 4 }),
  };
  expect(formatEmotionLine(record)).toBe(`裂焰 | 生气 | ${formatEmotionDate(createdAt)}`);
});
