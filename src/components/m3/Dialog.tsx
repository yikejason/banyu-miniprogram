import { View, Text } from "@tarojs/components";
import type { ReactNode } from "react";
import "./Dialog.scss";

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <View className="dialog-mask" onClick={onClose}>
      <View className="dialog">
        <Text className="dialog-title">{title}</Text>
        <View className="dialog-body">{children}</View>
        <View className="dialog-footer">
          <Text className="dialog-close" onClick={onClose}>
            关闭
          </Text>
        </View>
      </View>
    </View>
  );
}
