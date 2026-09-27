import { View } from "@tarojs/components";
import Taro, { useRouter, useLoad } from "@tarojs/taro";
import { NightScene } from "@/components/layout/NightScene";
import { JournalEditor } from "@/components/journal/JournalEditor";
import "./index.scss";

export default function JournalEditPage() {
  const router = useRouter();
  const id = router.params.id;

  useLoad(() => {
    if (id) Taro.setNavigationBarTitle({ title: "编辑日记" });
  });

  return (
    <NightScene title={id ? "编辑日记" : "写一篇"} subtitle="加密留在本机，不上云端。">
      <View className="journal-edit-page">
        <JournalEditor id={id} />
      </View>
    </NightScene>
  );
}
