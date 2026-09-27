import { View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { NightScene } from "@/components/layout/NightScene";
import { ShareViewer } from "@/components/share/ShareViewer";
import "./index.scss";

export default function ShareViewPage() {
  const router = useRouter();
  const id = router.params.id ?? "";
  const keyParam = router.params.k ?? "";

  return (
    <NightScene title="伴语星球" subtitle="有人把性情和此刻，只交给你。">
      <View className="share-view-page">
        <ShareViewer id={id} keyParam={keyParam} />
      </View>
    </NightScene>
  );
}
