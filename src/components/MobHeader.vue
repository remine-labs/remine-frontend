<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PhCaretLeft, PhGear } from "@phosphor-icons/vue";
import { useHeaderTitle } from "../composables/useHeaderTitle";

const route = useRoute();
const router = useRouter();
const { headerTitle, setHeaderTitle } = useHeaderTitle();

// TODO: 추후 vue-router RouteMeta를 확장하는 방식 고려
type HeaderMeta = {
  title?: string;
  titleType?: "dynamic";
  showBack?: boolean;
};

const header = computed<HeaderMeta>(() => route.meta.header as HeaderMeta);

watch(
  () => route.fullPath,
  () => setHeaderTitle(null),
  { immediate: true },
);

const title = computed(() => {
  // 동적 타이틀이 필요한 페이지
  if (header.value?.titleType === "dynamic") {
    return headerTitle.value ?? header.value.title ?? "";
  }

  // 기본 정적 타이틀
  return header.value?.title ?? "ReMine";
});

const showBack = computed(() => header.value?.showBack);
const isHome = computed(() => route.name === "home");

const goToSettings = () => {
  router.push(`/settings`);
};
</script>

<template>
  <header>
    <div class="header">
      <div class="wrap">
        <div class="title-box">
          <div v-if="showBack" class="icon-box">
            <button @click="router.back()">
              <PhCaretLeft :size="32" />
            </button>
          </div>
          <h1 :class="isHome ? 'logo' : 'page-title'">{{ title }}</h1>
        </div>
        <div class="icon-box" @click="goToSettings">
          <button class="icon settings">
            <PhGear :size="24"></PhGear>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style>
header {
  position: fixed;
  width: 100%;
  max-width: var(--frame-width);
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  overflow: hidden;
  z-index: 999;
}

.header {
  height: var(--header-height);
  box-shadow: 0px 2px 6px #0000001e;
  margin-bottom: 6px;
}

.header .wrap {
  display: flex;
  gap: 10px;
  height: inherit;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-elevated);
}

.header .title-box {
  display: flex;
  align-items: center;
}

.header .title-box .icon-box {
  margin-right: 10px;
}
</style>
