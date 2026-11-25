<script setup lang="ts">
import MobHeader from "./MobHeader.vue";
import MobMenu from "./MobMenu.vue";
</script>

<template>
    <MobHeader />
    <div>
        <RouterView :key="$route.name === 'reviewDetail' ? String($route.params.reviewId) : undefined" />
    </div>
    <MobMenu />
</template>
