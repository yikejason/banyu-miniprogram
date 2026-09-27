import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { Button } from "@/components/m3/Button";
import { TextField } from "@/components/m3/TextField";
import { createJournal, getJournal, updateJournal } from "@/lib/journal/repository";
import { ensureDeviceVault } from "@/lib/storage/vault";
import "./JournalEditor.scss";

export function JournalEditor({ id }: { id?: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [emotionId, setEmotionId] = useState("");

  useEffect(() => {
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
    // 金库未解锁时加密会抛错，先确保设备金库就绪
    await ensureDeviceVault();
    if (id) {
      await updateJournal(id, { title, body, emotionId: emotionId || undefined });
    } else {
      const created = await createJournal({ title, body, emotionId: emotionId || undefined });
      Taro.redirectTo({ url: `/pages/journal-edit/index?id=${created.id}` });
      return;
    }
    Taro.navigateBack();
  }

  return (
    <View className="editor">
      <TextField label="标题" value={title} onChange={setTitle} />
      <TextField label="正文" value={body} onChange={setBody} textarea />
      <Button variant="filled" onClick={onSave}>
        保存
      </Button>
    </View>
  );
}
