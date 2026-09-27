import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import { PlanetView } from "@/components/planet/PlanetView";
import { Card } from "@/components/m3/Card";
import { decryptSnapshot, importContentKey } from "@/lib/share/payload";
import type { ShareSnapshot } from "@/lib/share/types";
import { apiGet } from "@/lib/api";
import "./ShareViewer.scss";

export function ShareViewer({ id, keyParam }: { id: string; keyParam: string }) {
  const [snap, setSnap] = useState<ShareSnapshot | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    async function load() {
      if (!keyParam) {
        setClosed(true);
        return;
      }
      try {
        const enc = await apiGet<{ iv: string; ciphertext: string }>(`/api/shares/${id}`);
        const key = importContentKey(keyParam);
        setSnap(await decryptSnapshot(enc, key));
      } catch {
        setClosed(true);
      }
    }
    load();
  }, [id, keyParam]);

  if (closed) {
    return <Text className="share-viewer-empty">这份分享已关闭或从不存在。</Text>;
  }
  if (!snap) return <Text className="share-viewer-empty">正在打开…</Text>;

  return (
    <View className="share-viewer">
      <PlanetView visual={snap.status.visual} />
      <Card className="share-viewer-card">
        <Text className="share-viewer-label">性情</Text>
        <Text className="share-viewer-value">{snap.temperament.tone}</Text>
        {snap.temperament.style ? (
          <Text className="share-viewer-sub">{snap.temperament.style}</Text>
        ) : null}
      </Card>
      <Card className="share-viewer-card">
        <Text className="share-viewer-label">状态</Text>
        <Text className="share-viewer-value">{snap.status.label}</Text>
        {snap.status.note ? <Text className="share-viewer-sub">{snap.status.note}</Text> : null}
      </Card>
    </View>
  );
}
