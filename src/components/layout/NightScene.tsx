import { View, Text } from "@tarojs/components";
import type { ReactNode } from "react";
import { Starfield } from "@/components/planet/Starfield";
import "./NightScene.scss";

export function NightScene({
  kicker = "",
  title,
  subtitle,
  children,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <View className="planet-scene night-scene">
      <Starfield />
      <View className="night-inner">
        <View className="night-header">
          <Text className="night-kicker">{kicker}</Text>
          <Text className="night-title">{title}</Text>
          {subtitle ? <Text className="night-subtitle">{subtitle}</Text> : null}
        </View>
        {children}
      </View>
    </View>
  );
}
