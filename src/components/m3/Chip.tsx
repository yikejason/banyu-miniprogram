import { View } from "@tarojs/components";
import type { ReactNode } from "react";
import "./Chip.scss";

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <View
      className={`chip ${selected ? "chip-on" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {children}
    </View>
  );
}
