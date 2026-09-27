import { View, Text } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useEffect, useState } from "react";
import { PlanetView } from "@/components/planet/PlanetView";
import { listEmotions } from "@/lib/emotion/repository";
import { mapEmotion } from "@/lib/emotion/mapEmotion";
import type { EmotionRecord } from "@/lib/emotion/types";
import { companionById, getMoodCompanion, type MoodCompanionId } from "@/lib/mood/companion";
import "./index.scss";

export default function PlanetPage() {
  const [current, setCurrent] = useState<EmotionRecord | null>(null);
  const [history, setHistory] = useState<EmotionRecord[]>([]);
  const [companionId, setCompanionId] = useState<MoodCompanionId | null>(null);

  useLoad(() => {
    if (Taro.getStorageSync("banyu-cover-entered") !== "1") {
      Taro.reLaunch({ url: "/pages/cover/index" });
    }
  });

  useEffect(() => {
    setCompanionId(getMoodCompanion());
    listEmotions().then((list) => {
      setHistory(list);
      setCurrent(list[0] ?? null);
    });
  }, []);

  const figure = companionId ? companionById(companionId) : null;
  const visual =
    current?.visual ?? mapEmotion({ intensity: 3, kind: figure?.kind ?? "unspoken" });

  return (
    <View className="planet-scene planet-page">
      <View className="planet-page-inner">
        <View className="planet-page-header">
          <Text className="planet-page-title">伴语星球</Text>
          <Text
            className="planet-page-link"
            onClick={() => Taro.switchTab({ url: "/pages/emotions/index" })}
          >
            我的情绪足迹 →
          </Text>
        </View>
        <PlanetView
          visual={visual}
          figureSrc={figure?.src}
          figureLabel={figure?.label}
          traces={history.slice(0, 8).map((record) => ({
            id: record.id,
            hue: record.visual.hue,
            label: record.visual.label,
          }))}
          activeId={current?.id}
          onSelect={(id) => {
            const next = history.find((record) => record.id === id);
            if (next) setCurrent(next);
          }}
        />
      </View>
    </View>
  );
}
