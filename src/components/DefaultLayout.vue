<script setup lang="ts">
import MobHeader from "./MobHeader.vue";
import MobMenu from "./MobMenu.vue";
</script>

<template>
    <MobHeader />
    <main>
        <RouterView />
    </main>
    <MobMenu />
</template>