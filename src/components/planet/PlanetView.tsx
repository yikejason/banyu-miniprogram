import { View, Text, Canvas, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect } from "react";
import type { PlanetVisual } from "@/lib/emotion/types";
import "./PlanetView.scss";

export type PlanetTrace = {
  id: string;
  hue: number;
  label: string;
};

function fillFor(visual: PlanetVisual): string {
  return `hsl(${visual.hue} ${visual.chroma}% ${46 - visual.glow * 6}%)`;
}

function drawWeather(canvasNode: HTMLCanvasElement, w: number, h: number, visual: PlanetVisual) {
  const ctx = canvasNode.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  const sx = w / 240;
  const sy = h / 240;
  ctx.save();
  ctx.scale(sx, sy);

  if (visual.weather === "mist") {
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.ellipse(120, 118, 70, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (visual.weather === "rain") {
    ctx.strokeStyle = "rgba(207,228,255,0.45)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(90 + i * 14, 62);
      ctx.lineTo(82 + i * 14, 92);
      ctx.stroke();
    }
  }
  if (visual.weather === "aurora") {
    ctx.strokeStyle = "rgba(240,183,255,0.45)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(55, 100);
    ctx.bezierCurveTo(95, 58, 140, 142, 185, 88);
    ctx.stroke();
  }
  if (visual.weather === "eclipse") {
    ctx.fillStyle = "rgba(13,10,22,0.55)";
    ctx.beginPath();
    ctx.arc(138, 106, 50, 0, Math.PI * 2);
    ctx.fill();
  }

  if (visual.companion === "moon") {
    ctx.fillStyle = "#f4eff4";
    ctx.beginPath();
    ctx.arc(176, 72, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  if (visual.companion === "ring") {
    ctx.strokeStyle = "rgba(230,221,255,0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(120, 124, 76, 16, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (visual.companion === "spark") {
    ctx.fillStyle = "#fff7c2";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(62 + i * 16, 64 + i * 7, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function PlanetView({
  visual,
  traces = [],
  activeId,
  onSelect,
  figureSrc,
  figureLabel,
}: {
  visual: PlanetVisual;
  traces?: PlanetTrace[];
  activeId?: string;
  onSelect?: (id: string) => void;
  figureSrc?: string;
  figureLabel?: string;
}) {
  const fill = fillFor(visual);
  const glow = 0.35 + visual.glow * 0.55;

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query
      .select("#planet-canvas")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) return;
        const canvas = res[0].node as HTMLCanvasElement;
        const dpr = Taro.getSystemInfoSync().pixelRatio;
        const w = res[0].width;
        const h = res[0].height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);
        drawWeather(canvas, w, h, visual);
      });
  }, [visual]);

  return (
    <View className="planet-view">
      <View className="planet-stage">
        <View
          className="planet-aura"
          style={{
            background: `radial-gradient(circle, ${fill} 0%, transparent 70%)`,
            opacity: glow,
          }}
        />
        <View className="planet-ring-deco" />
        <View
          className="planet-core"
          style={{
            background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,0.7) 0%, ${fill} 42%, ${fill} 100%)`,
            opacity: 0.35 + glow * 0.35 + 0.65,
          }}
        />
        <Canvas type="2d" id="planet-canvas" className="planet-canvas" />
        {figureSrc && (
          <View className="planet-figure">
            <Image className="planet-figure-img" src={figureSrc} mode="aspectFit" />
          </View>
        )}
        {traces.slice(0, 8).map((trace, i) => {
          const angle = (i / Math.max(traces.length, 8)) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + 38 * Math.cos(angle);
          const top = 53 + 15 * Math.sin(angle);
          const active = trace.id === activeId;
          return (
            <View
              key={trace.id}
              className={`planet-trace ${active ? "planet-trace-on" : ""}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                background: `hsl(${trace.hue} 80% 72%)`,
                boxShadow: `0 0 12px hsl(${trace.hue} 80% 72%)`,
              }}
              onClick={() => onSelect?.(trace.id)}
            />
          );
        })}
      </View>
      <Text className="planet-label">{visual.label}</Text>
    </View>
  );
}
