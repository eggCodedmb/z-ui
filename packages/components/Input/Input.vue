<template>
    <div>
         <slot name="prepend">
         </slot>
        <input style="color: blue" v-bind="$attrs" type="text"></input>
        <slot name="append">
        </slot>
        
    </div>
</template>
<script setup lang="ts">
defineOptions({
  name: "ZInput",
});
</script>
<style lang="css" scoped></style>
