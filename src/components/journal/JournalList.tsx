import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import type { JournalEntry } from "@/lib/journal/types";
import "./JournalList.scss";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function JournalList({ items }: { items: JournalEntry[] | null }) {
  if (!items) return <Text className="journal-loading">读取中…</Text>;
  if (items.length === 0) {
    return (
      <View className="planet-glass journal-empty">
        <Text>这里只属于你。</Text>
        <Text className="journal-empty-sub">还没有写下任何一篇。</Text>
      </View>
    );
  }

  return (
    <View className="planet-glass journal-list">
      {items.map((entry, index) => (
        <View
          key={entry.id}
          className={`journal-row ${index === 0 ? "" : "journal-row-border"}`}
          onClick={() =>
            Taro.navigateTo({ url: `/pages/journal-detail/index?id=${entry.id}` })
          }
        >
          <Text className="journal-row-title">{entry.title}</Text>
          <Text className="journal-row-date">{formatDate(entry.createdAt)}</Text>
        </View>
      ))}
    </View>
  );
}
