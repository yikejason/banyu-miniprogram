import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import type { JournalEntry } from "@/lib/journal/types";
import "./JournalSky.scss";

function hash(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function place(item: JournalEntry, index: number, total: number) {
  const h = hash(item.id);
  if (total === 1) {
    return { left: 50, top: 42, size: 16, delay: "0.2s" };
  }
  const golden = Math.PI * (3 - Math.sqrt(5));
  const angle = index * golden + (h % 80) / 260;
  const radius = 10 + Math.sqrt((index + 0.4) / total) * 36;
  return {
    left: Math.min(90, Math.max(10, 50 + radius * Math.cos(angle))),
    top: Math.min(86, Math.max(12, 48 + radius * Math.sin(angle) * 0.7)),
    size: 10 + (h % 12),
    delay: `${(h % 9) * 0.35}s`,
  };
}

export function JournalSky({ items }: { items: JournalEntry[] }) {
  return (
    <View className="journal-sky">
      {items.map((item, index) => {
        const star = place(item, index, items.length);
        const date = item.createdAt.slice(5, 10).replace("-", ".");
        return (
          <View
            key={item.id}
            className="journal-star-wrap"
            style={{ left: `${star.left}%`, top: `${star.top}%` }}
            onClick={() => Taro.navigateTo({ url: `/pages/journal-edit/index?id=${item.id}` })}
          >
            <View
              className="journal-entry-star"
              style={{
                width: `${star.size}rpx`,
                height: `${star.size}rpx`,
                animationDelay: star.delay,
              }}
            />
            <Text className="journal-star-title">{item.title}</Text>
          </View>
        );
      })}
    </View>
  );
}
