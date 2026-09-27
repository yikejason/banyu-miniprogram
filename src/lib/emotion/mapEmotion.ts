import type { EmotionInput, EmotionKind, PlanetVisual } from "./types";

const KIND_VISUAL: Record<
  EmotionKind,
  Pick<PlanetVisual, "hue" | "weather" | "companion" | "label">
> = {
  joy: { hue: 48, weather: "clear", companion: "spark", label: "暖光" },
  calm: { hue: 200, weather: "mist", companion: "moon", label: "静海" },
  sad: { hue: 230, weather: "rain", companion: "dust", label: "潮汐" },
  anxious: { hue: 30, weather: "wind", companion: "ring", label: "风环" },
  angry: { hue: 12, weather: "wind", companion: "spark", label: "裂焰" },
  tender: { hue: 320, weather: "aurora", companion: "moon", label: "薄暮" },
  empty: { hue: 260, weather: "eclipse", companion: "none", label: "虚空" },
  mixed: { hue: 180, weather: "mist", companion: "ring", label: "层云" },
  unspoken: { hue: 270, weather: "mist", companion: "dust", label: "未名" },
};

const RULES: [RegExp, EmotionKind][] = [
  [/说不清|说不出口|未名/, "unspoken"],
  [/混杂|复杂|说不明/, "mixed"],
  [/开心|喜悦|轻松|高兴/, "joy"],
  [/平静|安稳|安静/, "calm"],
  [/难过|哭|悲伤|伤心/, "sad"],
  [/不安|焦虑|紧张/, "anxious"],
  [/生气|烦|愤怒/, "angry"],
  [/温柔|想念|柔软/, "tender"],
  [/空|麻木|空洞/, "empty"],
];

export function inferKind(text: string): EmotionKind {
  const t = text.trim();
  if (!t) return "unspoken";
  for (const [re, kind] of RULES) {
    if (re.test(t)) return kind;
  }
  return "unspoken";
}

export function mapEmotion(input: EmotionInput): PlanetVisual {
  const kind = input.kind ?? inferKind(input.text ?? "");
  const base = KIND_VISUAL[kind];
  return {
    ...base,
    glow: (input.intensity - 1) / 4,
    chroma: 20 + input.intensity * 8,
  };
}
