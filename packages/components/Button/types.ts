import type { Component } from "vue";

export type ButtonType = "primary" | "secondary" | "danger" | "link";
export type NativeType = "button" | "submit" | "reset";
export type ButtonSize = "default" | "small" | "large";


export interface ButtonProps {
  tag?: string | Component;
  type?: ButtonType;
  size?: ButtonSize;
  nativeType?: NativeType;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  round?: boolean;
  circle?: boolean;
  plain?: boolean;
}
