<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhBell, PhCaretLeft } from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()

// TODO: 추후 vue-router RouteMeta를 확장하는 방식 고려
type HeaderMeta = {
    title?: string
    titleType?: 'dynamic'
    showBack?: boolean
}

const header = computed<HeaderMeta>(() => route.meta.header as HeaderMeta)

const title = computed(() => {
    // 동적 타이틀이 필요한 페이지
    if (header.value?.titleType === 'dynamic') {
        return history.state.headerTitle ?? 'ReMine'
    }

    // 기본 정적 타이틀
    return header.value?.title ?? 'ReMine'
})

const showBack = computed(() => header.value?.showBack)
</script>

<template>
    <header>
        <div class="header-section">
            <div class="wrap">
                <div class="title-box">
                    <div v-if="showBack" class="icon-box">
                        <button @click="router.back()">
                            <PhCaretLeft :size="32" />
                        </button>
                    </div>
                    <!-- 페이지 이동 시, 페이지에 따라 header 값 변경으로 잡아두었으나, 현재 구조로는 딜레이 발생
                     추후 리팩토링을 통해 첫 렌더 전에 상태가 준비되도록 변경 예정 -->
                    <h1 class='logo'>{{ title }}</h1>
                </div>
                <div class="icon-box">
                    <button class='icon header-notice' type='button' aria-label='알림'>
                        <PhBell :size='24'></PhBell>
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

.header-section {
    height: var(--header-height);
    box-shadow: 0px 2px 6px #0000001e;
    margin-bottom: 6px;
}

.header-section .wrap {
    display: flex;
    gap: 10px;
    height: inherit;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-elevated);
}

.header-section .title-box {
    display: flex;
    align-items: center;
}

.header-section .title-box .icon-box {
    margin-right: 10px;
}
</style>
