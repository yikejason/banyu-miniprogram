import { useState } from "react";
import Taro, { useLoad } from "@tarojs/taro";
import { CoverScreen } from "@/components/cover/CoverScreen";
import { ensureDeviceVault } from "@/lib/storage/vault";
import { COVER_ALWAYS, COVER_FLAG } from "@/lib/coverGate";

export default function CoverPage() {
  const [entered, setEntered] = useState(false);
  const [busy, setBusy] = useState(false);

  useLoad(() => {
    if (!COVER_ALWAYS && Taro.getStorageSync(COVER_FLAG) === "1") {
      Taro.switchTab({ url: "/pages/planet/index" });
      return;
    }
    ensureDeviceVault().catch(() => {});
  });

  function onEnter() {
    setBusy(true);
    ensureDeviceVault()
      .then(() => {
        setEntered(true);
        Taro.navigateTo({ url: "/pages/mood/index" });
      })
      .catch(() => setBusy(false));
  }

  return <CoverScreen onEnter={onEnter} busy={busy || entered} />;
}
