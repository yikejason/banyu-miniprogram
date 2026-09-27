import { beforeEach, expect, test } from "vitest";
import {
  __resetMoodCompanionForTests,
  companionById,
  getMoodCompanion,
  setMoodCompanion,
} from "./companion";

beforeEach(() => {
  __resetMoodCompanionForTests();
});

test("stores and reads the chosen companion", () => {
  expect(getMoodCompanion()).toBeNull();
  setMoodCompanion("tender");
  expect(getMoodCompanion()).toBe("tender");
  expect(companionById("tender").label).toBe("薄暮");
});
