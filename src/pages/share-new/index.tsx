import { View } from "@tarojs/components";
import { useShareAppMessage } from "@tarojs/taro";
import { useState } from "react";
import { NightScene } from "@/components/layout/NightScene";
import { ShareComposer } from "@/components/share/ShareComposer";
import "./index.scss";

export default function ShareNewPage() {
  const [path, setPath] = useState("");

  useShareAppMessage(() => ({
    title: "伴语星球：我把此刻交给你",
    path: path || "/pages/planet/index",
  }));

  return (
    <NightScene title="发起分享" subtitle="只分享你写下的一句状态，不含日记正文。">
      <View className="share-new-page">
        <ShareComposer onCreated={setPath} />
      </View>
    </NightScene>
  );
}
