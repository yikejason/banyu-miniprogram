import { View } from "@tarojs/components";
import { NightScene } from "@/components/layout/NightScene";
import { EmotionTrail } from "@/components/emotion/EmotionTrail";
import "./index.scss";

export default function EmotionsPage() {
  return (
    <NightScene title="情绪足迹" subtitle="把感受留下，不必起一个准确的名字。">
      <View className="emotions-page">
        <EmotionTrail />
      </View>
    </NightScene>
  );
}
