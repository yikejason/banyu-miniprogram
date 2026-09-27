import { View } from "@tarojs/components";
import type { ReactNode } from "react";
import "./Card.scss";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <View className={`planet-glass card ${className}`}>{children}</View>;
}
