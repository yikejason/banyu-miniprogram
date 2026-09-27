import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { deleteEmotions, listEmotions } from "@/lib/emotion/repository";
import { formatEmotionLine } from "@/lib/emotion/labels";
import { MOCK_EMOTIONS } from "@/lib/emotion/mock";
import type { EmotionRecord } from "@/lib/emotion/types";
import "./EmotionTrail.scss";

function FigureMark({ hue }: { hue: number }) {
  return (
    <View
      className="figure-mark"
      style={{ background: `hsl(${hue} 55% 28%)`, color: `hsl(${hue} 72% 62%)` }}
    >
      <View className="figure-mark-icon" />
    </View>
  );
}

export function EmotionTrail() {
  const [items, setItems] = useState<EmotionRecord[] | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function reload() {
    const list = await listEmotions();
    // 本机还没有真实记录时，用演示数据撑起列表
    setItems(list.length > 0 ? list : MOCK_EMOTIONS);
  }

  useEffect(() => {
    reload();
  }, []);

  async function removeSelected() {
    if (picked.length === 0) return;
    setBusy(true);
    try {
      await deleteEmotions(picked);
      setPicked([]);
      setSelecting(false);
      await reload();
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: string) {
    setPicked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function exportLocal(records: EmotionRecord[]) {
    const payload = records.map((record) => ({
      createdAt: record.createdAt,
      label: record.visual.label,
      kind: record.input.kind,
      intensity: record.input.intensity,
      text: record.input.text ?? "",
      line: formatEmotionLine(record),
    }));
    // 小程序无文件下载，用剪贴板导出 JSON。
    await Taro.setClipboardData({ data: JSON.stringify(payload, null, 2) });
    Taro.showToast({ title: "已复制到剪贴板", icon: "none" });
  }

  if (!items) return <Text className="trail-empty">读取中…</Text>;

  return (
    <View className="trail">
      <View className="planet-glass trail-list">
        {items.length === 0 ? (
          <Text className="trail-empty">还没有留下情绪足迹。</Text>
        ) : (
          items.map((record, index) => {
            const active = picked.includes(record.id);
            return (
              <View
                key={record.id}
                className={`trail-row ${index === 0 ? "" : "trail-row-border"}`}
                onClick={() => selecting && toggle(record.id)}
              >
                <FigureMark hue={record.visual.hue} />
                <Text className="trail-line">{formatEmotionLine(record)}</Text>
                {selecting && (
                  <View className={`trail-check ${active ? "on" : ""}`}>
                    {active && <View className="trail-check-dot" />}
                  </View>
                )}
              </View>
            );
          })
        )}
        <View className="trail-note">
          <View className="trail-note-dot" />
          <Text>仅记录本机情绪选择，不自动上传</Text>
        </View>
      </View>

      <View className="trail-actions">
        {selecting ? (
          <>
            <View className="trail-btn" onClick={() => { setSelecting(false); setPicked([]); }}>
              <Text>取消</Text>
            </View>
            <View
              className={`trail-btn trail-btn-primary ${busy || picked.length === 0 ? "disabled" : ""}`}
              onClick={removeSelected}
            >
              <Text>删除所选</Text>
            </View>
          </>
        ) : (
          <>
            <View
              className={`trail-btn ${items.length === 0 ? "disabled" : ""}`}
              onClick={() => exportLocal(items)}
            >
              <Text>复制到剪贴板</Text>
            </View>
            <View
              className={`trail-btn ${items.length === 0 ? "disabled" : ""}`}
              onClick={() => setSelecting(true)}
            >
              <Text>选择删除</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
