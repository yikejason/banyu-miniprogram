import Taro from "@tarojs/taro";
import { MoodSelectScreen } from "@/components/mood/MoodSelectScreen";
import { setMoodCompanion } from "@/lib/mood/companion";

const COVER_FLAG = "banyu-cover-entered";

export default function MoodPage() {
  function onConfirm(id: Parameters<typeof setMoodCompanion>[0]) {
    setMoodCompanion(id);
    Taro.setStorageSync(COVER_FLAG, "1");
    Taro.switchTab({ url: "/pages/planet/index" });
  }

  return <MoodSelectScreen onConfirm={onConfirm} />;
}
