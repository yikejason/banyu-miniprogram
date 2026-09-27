import { View, Text, Image } from "@tarojs/components";
import { useState } from "react";
import { Starfield } from "@/components/planet/Starfield";
import { MOOD_COMPANIONS, type MoodCompanionId } from "@/lib/mood/companion";
import "./MoodSelectScreen.scss";

export function MoodSelectScreen({
  onConfirm,
}: {
  onConfirm: (id: MoodCompanionId) => void;
}) {
  const [selected, setSelected] = useState<MoodCompanionId | null>(null);

  return (
    <View className="planet-scene mood">
      <Starfield />
      <View className="mood-inner">
        <Text className="mood-title">请选择你的心情小人</Text>
        <View className="mood-hint">
          <Text>今天你的心情怎么样？</Text>
        </View>
        <View className="planet-glass mood-card">
          <View className="mood-figures">
            {MOOD_COMPANIONS.map((companion) => {
              const active = selected === companion.id;
              return (
                <View
                  key={companion.id}
                  className={`mood-figure ${active ? "mood-figure-on" : ""}`}
                  onClick={() => setSelected(companion.id)}
                >
                  <Image
                    className="mood-figure-img"
                    src={companion.src}
                    mode="aspectFit"
                  />
                  <Text className="mood-figure-label">{companion.label}</Text>
                  <Text className="mood-figure-hint">{companion.hint}</Text>
                </View>
              );
            })}
          </View>
          <Text className="mood-note">选定后，你的情绪状态将会在伴语星球展示</Text>
        </View>
        <View
          className={`cover-connect ${!selected ? "disabled" : ""}`}
          onClick={() => selected && onConfirm(selected)}
        >
          <Text>确认选择</Text>
        </View>
      </View>
    </View>
  );
}
