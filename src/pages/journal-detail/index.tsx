import { View, Text } from "@tarojs/components";
import Taro, { useRouter, useDidShow } from "@tarojs/taro";
import { useState } from "react";
import { NightScene } from "@/components/layout/NightScene";
import { Button } from "@/components/m3/Button";
import { getJournal } from "@/lib/journal/repository";
import type { JournalEntry } from "@/lib/journal/types";
import "./index.scss";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function JournalDetailPage() {
  const router = useRouter();
  const id = router.params.id;
  // undefined = 读取中，null = 不存在
  const [entry, setEntry] = useState<JournalEntry | null | undefined>(undefined);

  // 从编辑页返回时也重新读库，展示保存后的最新内容
  useDidShow(() => {
    if (!id) return;
    getJournal(id).then((e) => setEntry(e));
  });

  return (
    <NightScene title="日记" subtitle="这里只属于你，加密留在本机。">
      <View className="journal-detail-page">
        {entry === undefined ? (
          <Text className="journal-detail-tip">读取中…</Text>
        ) : entry === null ? (
          <Text className="journal-detail-tip">这篇日记不存在或已删除。</Text>
        ) : (
          <View className="planet-glass journal-detail-card">
            <Text className="journal-detail-title">{entry.title}</Text>
            <Text className="journal-detail-dates">
              {formatDate(entry.createdAt)}
              {entry.updatedAt !== entry.createdAt
                ? ` · 编辑于 ${formatDate(entry.updatedAt)}`
                : ""}
            </Text>
            <Text className="journal-detail-body">{entry.body}</Text>
          </View>
        )}
        {entry !== null && entry !== undefined && (
          <View className="journal-detail-actions">
            <Button
              variant="filled"
              onClick={() => Taro.navigateTo({ url: `/pages/journal-edit/index?id=${id}` })}
            >
              编辑这篇
            </Button>
          </View>
        )}
      </View>
    </NightScene>
  );
}
