<script setup lang="ts">
import Toast from "./components/Toast.vue";
</script>

<template>
  <div id="app-root">
    <router-view />
    <Toast />
  </div>
</template>

<style>
#app-root {
  max-width: var(--frame-width);
  margin: 0 auto;
  min-height: 100dvh;
  overflow: hidden;
  background-color: var(--bg-default);
}
</style>
