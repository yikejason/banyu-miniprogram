import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import { JournalSky } from "@/components/journal/JournalSky";
import { listJournals } from "@/lib/journal/repository";
import type { JournalEntry } from "@/lib/journal/types";
import "./JournalList.scss";

export function JournalList() {
  const [items, setItems] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    listJournals().then(setItems);
  }, []);

  if (!items) return <Text className="journal-loading">读取中…</Text>;
  if (items.length === 0) {
    return (
      <View className="planet-glass journal-empty">
        <Text>这里只属于你。</Text>
        <Text className="journal-empty-sub">还没有写下任何一篇。</Text>
      </View>
    );
  }

  return <JournalSky items={items} />;
}
