<script setup lang='ts'>
import { PhMagnifyingGlass } from '@phosphor-icons/vue';
</script>

<template>
    <section class="search-section">
        <div class="wrap">
            <div class="search-container">
                <div class="input-box">
                    <input type="text">
                </div>
                <div class="icon-box">
                    <button>
                        <PhMagnifyingGlass :size='24'></PhMagnifyingGlass>
                    </button>
                </div>
            </div>
            <div class="works-list-container">
                <div class="work-box">
                    작품 노출 박스
                </div>
            </div>
        </div>
    </section>
</template>