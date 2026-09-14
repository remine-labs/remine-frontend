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

const goToPage = (page: number) => {
    if (page < 1 || page > props.totalPages) return
    emit('page-change', page)
}

const goToFirstPage = () => {
    goToPage(1)
}

const goToPrevPage = () => {
    goToPage(Math.max(1, props.currentPage - visiblePageCount.value))
}

const goToNextPage = () => {
    goToPage(
        Math.min(
            props.totalPages,
            props.currentPage + visiblePageCount.value
        )
    )
}

const goToLastPage = () => {
    goToPage(props.totalPages)
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
            <button class="go-to-first-page" @click="goToFirstPage">
                <PhCaretDoubleLeft />
            </button>

            <button class="go-to-prev-10" @click="goToPrevPage">
                <PhCaretLeft />
            </button>
        </div>
        <div class="page-number btn-box">
            <button v-for="page in pages" :key="page" :class="{ active: page === currentPage }"
                @click="emit('page-change', page)">
                {{ page }}
            </button>
        </div>
        <div class="btn-box next-btn">
            <button class="go-to-next-10" @click="goToNextPage">
                <PhCaretRight />
            </button>

            <button class="go-to-last-page" @click="goToLastPage">
                <PhCaretDoubleRight />
            </button>
        </div>
    </div>
</template>

<style scoped>
.btn-box button {
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