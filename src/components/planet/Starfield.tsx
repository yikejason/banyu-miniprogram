import { View } from "@tarojs/components";
import "./Starfield.scss";

const STARS = Array.from({ length: 52 }, (_, i) => ({
  left: `${(i * 19 + 8) % 100}%`,
  top: `${(i * 37 + 13) % 100}%`,
  size: 1 + (i % 3),
  delay: `${(i % 7) * 0.45}s`,
  duration: `${2.4 + (i % 5) * 0.7}s`,
}));

export function Starfield() {
  return (
    <View className="starfield">
      {STARS.map((star, i) => (
        <View
          key={i}
          className="planet-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </View>
  );
}
