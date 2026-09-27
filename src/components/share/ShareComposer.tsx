import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { Button as M3Button } from "@/components/m3/Button";
import { TextField } from "@/components/m3/TextField";
import { listEmotions } from "@/lib/emotion/repository";
import type { EmotionRecord } from "@/lib/emotion/types";
import {
  buildSharePath,
  encryptSnapshot,
  hashToken,
  newShareSecrets,
} from "@/lib/share/payload";
import type { ShareLocal } from "@/lib/share/types";
import { getTemperament } from "@/lib/temperament/repository";
import { putRecord } from "@/lib/storage/vault";
import { apiPost } from "@/lib/api";
import "./ShareComposer.scss";

export function ShareComposer({
  onCreated,
}: {
  onCreated: (path: string) => void;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [latest, setLatest] = useState<EmotionRecord | null>(null);
  const [path, setPath] = useState("");

  useEffect(() => {
    listEmotions().then((list) => setLatest(list[0] ?? null));
  }, []);

  async function create() {
    setError("");
    const temperament = await getTemperament();
    if (!temperament?.tone) {
      setError("请先在星球页写下至少一句气质。");
      return;
    }
    if (!latest) {
      setError("请先留下此刻的状态。");
      return;
    }
    try {
      const { contentKey, contentKeyParam, revokeToken } = await newShareSecrets();
      const enc = await encryptSnapshot(
        {
          temperament,
          status: {
            label: latest.visual.label,
            intensity: latest.input.intensity,
            visual: latest.visual,
            note: note.trim() || undefined,
          },
          createdAt: new Date().toISOString(),
        },
        contentKey,
      );
      const revokeTokenHash = await hashToken(revokeToken);
      const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      const { id } = (await apiPost("/api/shares", {
        iv: enc.iv,
        ciphertext: enc.ciphertext,
        expiresAt,
        revokeTokenHash,
      })) as { id: string };
      const local: ShareLocal = {
        id,
        createdAt: new Date().toISOString(),
        revokeToken,
        expiresAt,
      };
      await putRecord("shareLocal", id, local);
      const sharePath = buildSharePath(id, contentKeyParam);
      setPath(sharePath);
      onCreated(sharePath);
    } catch {
      setError("无法生成链接");
    }
  }

  return (
    <View className="share-composer">
      <Text className="share-composer-hint">请把链接亲自发给想看见的人。</Text>
      <TextField label="简要状态（可选，不要写日记）" value={note} onChange={setNote} />
      <M3Button variant="filled" onClick={create}>
        生成分享链接
      </M3Button>
      {error && <Text className="share-composer-error">{error}</Text>}
      {path && (
        <View className="share-composer-result">
          <Text className="share-composer-path">{path}</Text>
          <Button
            className="share-composer-forward"
            openType="share"
            plain
          >
            分享给朋友
          </Button>
        </View>
      )}
    </View>
  );
}
