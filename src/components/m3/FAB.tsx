import { View, Text } from "@tarojs/components";
import "./FAB.scss";

export function FAB({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <View className="fab" onClick={onClick}>
      <Text>{label}</Text>
    </View>
  );
}
