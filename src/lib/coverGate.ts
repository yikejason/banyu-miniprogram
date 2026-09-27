// 封面页展示开关（开发调试用）。
//
// - COVER_ALWAYS = true  → 每次冷启动/刷新都先展示封面页（忽略已进入标记）
// - COVER_ALWAYS = false → 仅首次进入展示，之后刷新直接进星球（读缓存）
//
// 默认随构建模式自动切换：`dev:weapp` 为 true，`build:weapp`（体验/正式）为 false。
// 体验版也想强制每次看封面时，把 FORCE_COVER_ALWAYS 改成 true 再跑 build:weapp。
export const FORCE_COVER_ALWAYS = false;

export const COVER_ALWAYS: boolean =
  FORCE_COVER_ALWAYS || process.env.NODE_ENV === "development";

// “已进入过应用”的缓存标记（心情页首次完成后写入 "1"）。
export const COVER_FLAG = "banyu-cover-entered";
