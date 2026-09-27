import { useState } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { NightScene } from "@/components/layout/NightScene";
import { JournalList } from "@/components/journal/JournalList";
import { FAB } from "@/components/m3/FAB";
import { listJournals } from "@/lib/journal/repository";
import type { JournalEntry } from "@/lib/journal/types";
import "./index.scss";

export default function JournalPage() {
  const [items, setItems] = useState<JournalEntry[] | null>(null);

  // 每次回到日记 tab 都重新读库：tab 页常驻内存，useEffect 只跑一次会漏掉新建的日记
  useDidShow(() => {
    listJournals().then(setItems);
  });

  return (
    <NightScene title="日记星图" subtitle="这里只属于你，加密留在本机。">
      <View className="journal-page">
        <JournalList items={items} />
      </View>
      <FAB label="写一篇" onClick={() => Taro.navigateTo({ url: "/pages/journal-edit/index" })} />
    </NightScene>
  );
}
