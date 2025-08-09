<script setup lang="ts">
defineOptions({
  name: "App",
});
import { ref } from "vue";
const msg = ref("hello world");
</script>
<template>
  <div>
    <z-button type="link" size="small"> {{ msg }}</z-button>
  </div>
</template>
<style lang="css" scoped></style>
