import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { NightScene } from "@/components/layout/NightScene";
import { Card } from "@/components/m3/Card";
import { FAB } from "@/components/m3/FAB";
import { Button } from "@/components/m3/Button";
import { deleteRecord, listRecords } from "@/lib/storage/vault";
import type { ShareLocal } from "@/lib/share/types";
import { apiDelete } from "@/lib/api";
import "./index.scss";

export default function SharePage() {
  const [items, setItems] = useState<ShareLocal[] | null>(null);

  async function reload() {
    const list = await listRecords<ShareLocal>("shareLocal");
    setItems(list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  useEffect(() => {
    reload();
  }, []);

  async function stop(item: ShareLocal) {
    try {
      await apiDelete(`/api/shares/${item.id}`, { "x-revoke-token": item.revokeToken });
    } catch {
      // 即使后端失败也本地移除
    }
    await deleteRecord("shareLocal", item.id);
    await reload();
  }

  return (
    <NightScene title="私密分享" subtitle="链接由你亲自发给想看见的人，随时可以收回。">
      <View className="share-page">
        {!items || items.length === 0 ? (
          <View className="planet-glass share-empty">
            <Text>没有正在进行的分享。</Text>
            <Text className="share-empty-sub">需要被理解时，再打开一扇很小的门。</Text>
          </View>
        ) : (
          <View className="share-list">
            {items.map((item) => (
              <Card key={item.id} className="share-item">
                <Text className="share-item-time">
                  {item.createdAt.slice(0, 16).replace("T", " ")}
                </Text>
                <Text className="share-item-expire">
                  {item.expiresAt.slice(0, 10)} 到期
                </Text>
                <Button variant="outlined" className="share-item-stop" onClick={() => stop(item)}>
                  停止分享
                </Button>
              </Card>
            ))}
          </View>
        )}
      </View>
      <FAB label="发起分享" onClick={() => Taro.navigateTo({ url: "/pages/share-new/index" })} />
    </NightScene>
  );
}
