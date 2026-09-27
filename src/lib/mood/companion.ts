import type { EmotionKind } from "@/lib/emotion/types";
import warmImg from "@/assets/companions/warm.png";
import tenderImg from "@/assets/companions/tender.png";

export type MoodCompanionId = "warm" | "tender";

export const MOOD_COMPANIONS: {
  id: MoodCompanionId;
  label: string;
  hint: string;
  kind: EmotionKind;
  src: string;
}[] = [
  { id: "warm", label: "暖光", hint: "明亮、轻快", kind: "joy", src: warmImg },
  { id: "tender", label: "薄暮", hint: "柔软、想念", kind: "tender", src: tenderImg },
];

const KEY = "banyu-mood-companion";

function readKV(key: string): string | null {
  const g = globalThis as Record<string, unknown>;
  const wx = g.wx as { getStorageSync?: (k: string) => string | undefined } | undefined;
  if (wx?.getStorageSync) {
    const v = wx.getStorageSync(key);
    return v === undefined || v === "" ? null : (v as string);
  }
  if (typeof localStorage !== "undefined") return localStorage.getItem(key);
  return memKV.has(key) ? memKV.get(key)! : null;
}

function writeKV(key: string, value: string): void {
  const g = globalThis as Record<string, unknown>;
  const wx = g.wx as { setStorageSync?: (k: string, v: string) => void } | undefined;
  if (wx?.setStorageSync) {
    wx.setStorageSync(key, value);
    return;
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, value);
    return;
  }
  memKV.set(key, value);
}

const memKV = new Map<string, string>();

export function __resetMoodCompanionForTests(): void {
  memKV.clear();
}

export function getMoodCompanion(): MoodCompanionId | null {
  const value = readKV(KEY);
  return value === "warm" || value === "tender" ? value : null;
}

export function setMoodCompanion(id: MoodCompanionId) {
  writeKV(KEY, id);
}

export function companionById(id: MoodCompanionId) {
  return MOOD_COMPANIONS.find((item) => item.id === id)!;
}
