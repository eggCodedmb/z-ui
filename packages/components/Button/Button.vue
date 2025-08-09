<template>
  <component
    :is="tag"
    ref="_ref"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="loading || disabled ? true : void 0"
    :loading="loading"
    class="z-button"
    :class="{
      [`z-button--${size}`]: size,
      [`z-button--${type}`]: type,
      'z-button--loading': loading,
      'z-button--disabled': disabled,
      'z-button--round': round,
      'z-button--circle': circle,
      'z-button--plain': plain,
    }"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ButtonProps } from "./types";

defineOptions({
  name: "ZButton",
});
withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  type: "primary",
  size: "default",
  nativeType: "button",
  disabled: false,
  loadind: false,
  icon: "",
  round: false,
  circle: false,
  plain: false,
});

const slots = defineSlots();

const _ref = ref<HTMLButtonElement>();
</script>
<style scoped lang="css">
@import "./style.css";
</style>
