<script setup lang="ts">
import { PhBell } from "@phosphor-icons/vue";
</script>

<template>
    <header>
        <div class="header-section">
            <div class="wrap">
                <div class="logo-box">
                    <!-- 추후에 a태그 연결 -->
                    <p class="logo">ReMine</p>
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
.header-section {
    position: sticky;
    width: 100%;
    height: 7rem;
    top: 0;
    box-shadow: 0px 2px 6px #0000001e;
    z-index: 999;
}

.header-section .wrap {
    display: flex;
    height: inherit;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-elevated);
}
</style>