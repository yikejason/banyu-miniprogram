import { View, Text, Picker } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { Button } from "@/components/m3/Button";
import { TextField } from "@/components/m3/TextField";
import { createJournal, getJournal, updateJournal } from "@/lib/journal/repository";
import { listEmotions } from "@/lib/emotion/repository";
import type { EmotionRecord } from "@/lib/emotion/types";
import "./JournalEditor.scss";

export function JournalEditor({ id }: { id?: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [emotionId, setEmotionId] = useState("");
  const [emotions, setEmotions] = useState<EmotionRecord[]>([]);

  useEffect(() => {
    listEmotions().then(setEmotions);
    if (!id) return;
    getJournal(id).then((e) => {
      if (!e) return;
      setTitle(e.title);
      setBody(e.body);
      setEmotionId(e.emotionId ?? "");
    });
  }, [id]);

  async function onSave() {
    if (!body.trim()) return;
    if (id) {
      await updateJournal(id, { title, body, emotionId: emotionId || undefined });
    } else {
      const created = await createJournal({ title, body, emotionId: emotionId || undefined });
      Taro.redirectTo({ url: `/pages/journal-edit/index?id=${created.id}` });
      return;
    }
    Taro.navigateBack();
  }

  const options = ["不关联", ...emotions.map((e) => `${e.visual.label} · ${e.createdAt.slice(0, 10)}`)];
  const pickIndex = emotionId
    ? emotions.findIndex((e) => e.id === emotionId) + 1
    : 0;

  return (
    <View className="editor">
      <TextField label="标题（可空）" value={title} onChange={setTitle} />
      <TextField label="正文" value={body} onChange={setBody} textarea />
      <View className="editor-field">
        <Text className="editor-field-label">关联情绪</Text>
        <Picker
          mode="selector"
          range={options}
          value={pickIndex}
          onChange={(e) => {
            const idx = Number(e.detail.value);
            setEmotionId(idx === 0 ? "" : emotions[idx - 1].id);
          }}
        >
          <View className="editor-picker">{options[pickIndex]}</View>
        </Picker>
      </View>
      <Button variant="filled" onClick={onSave}>
        保存
      </Button>
    </View>
  );
}
