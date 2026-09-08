<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
    PhCaretDoubleLeft,
    PhCaretDoubleRight,
    PhCaretLeft,
    PhCaretRight,
} from '@phosphor-icons/vue'

const props = defineProps<{
    currentPage: number
    totalPages: number
}>()

const isMobile = ref(false)

const handleResize = () => {
    isMobile.value = window.innerWidth < 550
}

const visiblePageCount = computed(() => {
    return isMobile.value ? 5 : 10
})

const startPage = computed(() =>
    Math.floor((props.currentPage - 1) / visiblePageCount.value)
    * visiblePageCount.value + 1
)

const pages = computed(() => {
    const pageCount = Math.min(
        visiblePageCount.value,
        props.totalPages - startPage.value + 1
    )

    return Array.from(
        { length: pageCount },
        (_, index) => startPage.value + index
    )
})

const emit = defineEmits<{
    (e: 'page-change', page: number): void
}>()

onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <div class="pagination-container">
        <div class="btn-box prev-btn">
            <button class="go-to-first-page">
                <PhCaretDoubleLeft />
            </button>
            <button class="go-to-prev-10">
                <PhCaretLeft />
            </button>
        </div>
        <div class="page-number btn-box">
            <button v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
                {{ page }}
            </button>
        </div>
        <div class="btn-box next-btn">
            <button class="go-to-next-10">
                <PhCaretRight />
            </button>
            <button class="go-to-last-page">
                <PhCaretDoubleRight />
            </button>
        </div>
    </div>
</template>

<style scoped>
button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    min-width: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    flex-shrink: 0;
}

button.active {
    background-color: var(--btn-active-bg);
    color: #f6f4f0
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.prev-btn,
.next-btn {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.page-number {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
}
</style>