import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { Button as M3Button } from "@/components/m3/Button";
import { TextField } from "@/components/m3/TextField";
import {
  buildSharePath,
  encryptSnapshot,
  hashToken,
  newShareSecrets,
} from "@/lib/share/payload";
import type { ShareLocal } from "@/lib/share/types";
import { putRecord } from "@/lib/storage/vault";
import { createShareCloud } from "@/lib/share/cloud";
import "./ShareComposer.scss";

export function ShareComposer({
  onCreated,
}: {
  onCreated: (path: string) => void;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [path, setPath] = useState("");

  async function create() {
    setError("");
    const text = note.trim();
    if (!text) {
      setError("写一句简要状态吧。");
      return;
    }
    try {
      const { contentKey, contentKeyParam, revokeToken } = await newShareSecrets();
      const enc = await encryptSnapshot(
        {
          note: text,
          createdAt: new Date().toISOString(),
        },
        contentKey,
      );
      const revokeTokenHash = await hashToken(revokeToken);
      const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      const { id } = await createShareCloud({
        iv: enc.iv,
        ciphertext: enc.ciphertext,
        expiresAt,
        revokeTokenHash,
      });
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法生成链接");
    }
  }

  return (
    <View className="share-composer">
      <Text className="share-composer-hint">请把链接亲自发给想看见的人。</Text>
      <TextField label="简要状态（不要写日记）" value={note} onChange={setNote} />
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
