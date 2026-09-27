import { View, Text, Input, Textarea } from "@tarojs/components";
import type { InputProps, TextareaProps } from "@tarojs/components";
import "./TextField.scss";

export function TextField({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <View className="field">
      <Text className="field-label">{label}</Text>
      {textarea ? (
        <Textarea
          className="field-input field-area"
          value={value}
          placeholder={placeholder}
          onInput={(e: Parameters<NonNullable<TextareaProps["onInput"]>>[0]) =>
            onChange(e.detail.value)
          }
        />
      ) : (
        <Input
          className="field-input"
          type={type as InputProps["type"]}
          value={value}
          placeholder={placeholder}
          onInput={(e: Parameters<NonNullable<InputProps["onInput"]>>[0]) =>
            onChange(e.detail.value)
          }
        />
      )}
    </View>
  );
}
