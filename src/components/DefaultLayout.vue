<script setup lang="ts">
import MobHeader from "./MobHeader.vue";
import MobMenu from "./MobMenu.vue";
</script>

<template>
    <MobHeader />
    <div>
        <RouterView />
    </div>
    <MobMenu />
</template>