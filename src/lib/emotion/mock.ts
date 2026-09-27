import type { EmotionRecord } from "./types";

/** 情绪足迹的演示数据（仿设计稿：红/黄/蓝 + 日期）。
 *
 * 仅在本机还没有任何真实记录时展示；存入真实情绪后自动隐藏。
 * 正式上线前删掉本文件和 EmotionTrail 里的引用即可。
 */

// 2026-09-27 造的固定日期 mock，早于今天的 9 月 13–17 日
function at(date: string): string {
  return `${date}T08:00:00.000Z`;
}

const RED: EmotionRecord["visual"] = {
  hue: 12,
  chroma: 52,
  weather: "wind",
  glow: 0.75,
  companion: "spark",
  label: "红色",
};

const YELLOW: EmotionRecord["visual"] = {
  hue: 48,
  chroma: 44,
  weather: "clear",
  glow: 0.5,
  companion: "spark",
  label: "黄色",
};

const BLUE: EmotionRecord["visual"] = {
  hue: 230,
  chroma: 36,
  weather: "rain",
  glow: 0.25,
  companion: "dust",
  label: "蓝色",
};

export const MOCK_EMOTIONS: EmotionRecord[] = [
  {
    id: "mock-1",
    createdAt: at("2026-09-17"),
    input: { kind: "angry", intensity: 4, text: "有点烦躁" },
    visual: RED,
  },
  {
    id: "mock-2",
    createdAt: at("2026-09-16"),
    input: { kind: "joy", intensity: 3, text: "轻松的一天" },
    visual: YELLOW,
  },
  {
    id: "mock-3",
    createdAt: at("2026-09-15"),
    input: { kind: "sad", intensity: 2, text: "有点低落" },
    visual: BLUE,
  },
  {
    id: "mock-4",
    createdAt: at("2026-09-14"),
    input: { kind: "angry", intensity: 3, text: "被小事惹恼" },
    visual: RED,
  },
  {
    id: "mock-5",
    createdAt: at("2026-09-13"),
    input: { kind: "joy", intensity: 2, text: "散步很开心" },
    visual: YELLOW,
  },
];
