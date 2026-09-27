import { inferKind } from "./mapEmotion";
import type { EmotionKind, EmotionRecord } from "./types";

export const KIND_LABELS: Record<EmotionKind, string> = {
  joy: "喜悦",
  calm: "平静",
  sad: "难过",
  anxious: "不安",
  angry: "生气",
  tender: "温柔",
  empty: "空",
  mixed: "混杂",
  unspoken: "说不清",
};

export function emotionKindLabel(kind?: EmotionKind, text?: string): string {
  return KIND_LABELS[kind ?? inferKind(text ?? "")];
}

export function formatEmotionDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function formatEmotionLine(record: EmotionRecord): string {
  const kind = emotionKindLabel(record.input.kind, record.input.text);
  return `${record.visual.label} | ${kind} | ${formatEmotionDate(record.createdAt)}`;
}
