import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { NightScene } from "@/components/layout/NightScene";
import { JournalList } from "@/components/journal/JournalList";
import { FAB } from "@/components/m3/FAB";
import "./index.scss";

export default function JournalPage() {
  return (
    <NightScene title="日记星图" subtitle="这里只属于你，加密留在本机。">
      <View className="journal-page">
        <JournalList />
      </View>
      <FAB label="写一篇" onClick={() => Taro.navigateTo({ url: "/pages/journal-edit/index" })} />
    </NightScene>
  );
}
