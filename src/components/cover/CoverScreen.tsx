import { View, Text, Image } from "@tarojs/components";
import { Starfield } from "@/components/planet/Starfield";
import goldImg from "@/assets/orbs/gold.png";
import blueImg from "@/assets/orbs/blue.png";
import heartImg from "@/assets/orbs/heart.png";
import "./CoverScreen.scss";

const ORBS = [
  { src: goldImg, label: "暖光", glow: "#f5c56b", duration: "7.5s" },
  { src: blueImg, label: "静海", glow: "#8bd0ff", duration: "10s", reverse: true },
  { src: heartImg, label: "薄暮", glow: "#ff8eb4", duration: "8.5s" },
] as const;

function Orb({
  src,
  label,
  glow,
  duration,
  reverse,
}: {
  src: string;
  label: string;
  glow: string;
  duration: string;
  reverse?: boolean;
}) {
  return (
    <View className="cover-orb" style={{ color: glow }}>
      <View
        className={`cover-orb-halo ${reverse ? "cover-orb-halo-rev" : ""}`}
        style={{ animationDuration: duration }}
      />
      <View
        className={`cover-orb-rim ${reverse ? "cover-orb-halo-rev" : ""}`}
        style={{ animationDuration: reverse ? "6.5s" : "5s" }}
      />
      <Image className="cover-orb-img" src={src} mode="aspectFit" style={{ filter: `drop-shadow(0 0 14px ${glow})` }} />
      <Text className="sr-only">{label}</Text>
    </View>
  );
}

export function CoverScreen({
  onEnter,
  busy,
}: {
  onEnter: () => void;
  busy?: boolean;
}) {
  return (
    <View className="planet-scene cover">
      <Starfield />
      <View className="cover-inner">
        <View className="cover-logo">
          {/* 简化 logo：用 CSS 圆 + 环代替 SVG */}
          <View className="cover-logo-ring" />
          <View className="cover-logo-planet" />
        </View>
        <View className="planet-glass cover-card">
          <View className="cover-badge">
            <View className="cover-badge-dot" />
            <Text>伴语星球</Text>
          </View>
          <Text className="cover-title">于同一颗星球，{"\n"}听见彼此心底的声音。</Text>
          <View className="cover-orbs">
            {ORBS.map((orb) => (
              <Orb key={orb.label} {...orb} />
            ))}
          </View>
          <Text className="cover-sub">— 进入伴语星球 —</Text>
        </View>
        <View className="cover-connect" onClick={onEnter}>
          <Text>{busy ? "正在连接…" : "开始连接"}</Text>
        </View>
      </View>
    </View>
  );
}
