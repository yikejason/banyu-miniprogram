import { inferKind, mapEmotion } from "./mapEmotion";
import { expect, test } from "vitest";

test("empty text without kind is unspoken", () => {
  const v = mapEmotion({ intensity: 2 });
  expect(v.label).toBe("未名");
  expect(v.weather).toBe("mist");
});

test("keyword 不安 infers anxious", () => {
  expect(inferKind("今晚有点不安")).toBe("anxious");
});

test("same input is stable", () => {
  const a = mapEmotion({ text: "说不清", intensity: 3 });
  const b = mapEmotion({ text: "说不清", intensity: 3 });
  expect(a).toEqual(b);
});

test("does not use clinical labels", () => {
  const v = mapEmotion({ kind: "sad", intensity: 5 });
  expect(v.label).not.toMatch(/抑郁|障碍|诊断/);
});
