import { Button as TaroButton } from "@tarojs/components";
import type { ButtonProps } from "@tarojs/components";
import "./Button.scss";

type Variant = "filled" | "outlined" | "text" | "tonal";

const VARIANT_CLASS: Record<Variant, string> = {
  filled: "btn-filled",
  outlined: "btn-outlined",
  text: "btn-text",
  tonal: "btn-tonal",
};

export function Button({
  variant = "filled",
  className = "",
  children,
  ...props
}: Omit<ButtonProps, "size" | "type"> & { variant?: Variant }) {
  return (
    <TaroButton
      className={`btn ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {children as unknown as string}
    </TaroButton>
  );
}
