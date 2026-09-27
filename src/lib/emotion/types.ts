export type EmotionKind =
  | "joy"
  | "calm"
  | "sad"
  | "anxious"
  | "angry"
  | "tender"
  | "empty"
  | "mixed"
  | "unspoken";

export type EmotionInput = {
  text?: string;
  kind?: EmotionKind;
  intensity: 1 | 2 | 3 | 4 | 5;
};

export type PlanetVisual = {
  hue: number;
  chroma: number;
  weather: "clear" | "mist" | "rain" | "wind" | "aurora" | "eclipse";
  glow: number;
  companion: "none" | "moon" | "ring" | "spark" | "dust";
  label: string;
};

export type EmotionRecord = {
  id: string;
  createdAt: string;
  input: EmotionInput;
  visual: PlanetVisual;
};
