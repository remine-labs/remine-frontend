<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhBell, PhCaretLeft } from '@phosphor-icons/vue'

// TODO: 추후 vue-router RouteMeta를 확장하는 방식 고려
type HeaderMeta = {
    title?: string
    titleType?: 'dynamic'
    showBack?: boolean
}

const route = useRoute()
const router = useRouter()

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
                    <button v-if="showBack" @click="router.back()">
                        <PhCaretLeft :size='32'></PhCaretLeft>
                    </button>
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
    max-width: 47.5rem;
    top: 0;
    overflow: hidden;
    z-index: 999;
}

.header-section {
    height: 7rem;
    box-shadow: 0px 2px 6px #0000001e;
    margin-bottom: 6px;
}

.header-section .wrap {
    display: flex;
    height: inherit;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-elevated);
}

.header-section .title-box {
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>