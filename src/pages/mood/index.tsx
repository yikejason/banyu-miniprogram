import Taro from "@tarojs/taro";
import { MoodSelectScreen } from "@/components/mood/MoodSelectScreen";
import { setMoodCompanion } from "@/lib/mood/companion";
import { COVER_FLAG } from "@/lib/coverGate";

export default function MoodPage() {
  function onConfirm(id: Parameters<typeof setMoodCompanion>[0]) {
    setMoodCompanion(id);
    Taro.setStorageSync(COVER_FLAG, "1");
    Taro.switchTab({ url: "/pages/planet/index" });
  }

  return <MoodSelectScreen onConfirm={onConfirm} />;
}
