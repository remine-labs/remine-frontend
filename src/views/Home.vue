<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api/client'
import { PhPencil, PhStar } from "@phosphor-icons/vue"


const router = useRouter()

interface Review {
    reviewId: number
    workId: number
    workTitle: string
    workPosterPath: string
    workReleaseDate: string
    mediaType: string
    rating: number
    createdAt: string
}

const currentPage = ref(0)
const loading = ref(false)
const timeline = ref<Review[]>([])

const container = ref<HTMLElement | null>(null)

let isDragging = false
let startX = 0
let scrollLeft = 0

const handleMouseDown = (e: MouseEvent) => {
    if (!container.value) return

    isDragging = true
    startX = e.pageX - container.value.offsetLeft
    scrollLeft = container.value.scrollLeft
}

const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !container.value) return

    const x = e.pageX - container.value.offsetLeft
    const walk = x - startX

    container.value.scrollLeft = scrollLeft - walk
}

const handleMouseUp = () => {
    isDragging = false
}

const formatRelativeDate = (date: string | Date | null) => {
    if (!date) return ''

    const d = new Date(date)
    const today = new Date()

    const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    )

    const targetDate = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
    )

    const diff = Math.floor(
        (todayDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diff === 0) return '오늘'
    if (diff === 1) return '어제'
    return `${diff}일 전`
}

const goToReviewDetail = (reviewId: number) => {
    router.push(`/review/${reviewId}`)
}

const fetchTimeline = async (page: number) => {
    loading.value = true
    try {
        const res = await api.get('/api/reviews/timeline', {
            params: { page }
        })

        timeline.value = res.data.data
        currentPage.value = page
    } catch (error) {
        console.error('timeline 조회 실패', error)
        timeline.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchTimeline(0)
})

</script>

<template>
    <section class="home-section">
        <div class="wrap">
            <!-- TODO: 내가 최근에 쓴 리뷰 -->
            <h3 class="title">최근에 어떤 리뷰를 썼을까요?✏</h3>
            <div class="frame">
                <div ref="container" class="recent-reviews-container" @mousedown="handleMouseDown"
                    @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
                    <div class="review-card relative" v-for="item in timeline.slice(0, 3)" :key="item.reviewId"
                        @click="goToReviewDetail(item.reviewId)">
                        <div class="img-box">
                            <img :src="`https://image.tmdb.org/t/p/w200${item.workPosterPath}`"
                                :alt="`${item.workTitle} 포스터`">
                        </div>
                        <div class="review-info-box">
                            <div class="created-date">
                                <PhPencil class="icon pencil"></PhPencil>
                                <span>{{ formatRelativeDate(item.createdAt) }}</span>
                            </div>
                            <div class="rating">
                                <PhStar class="icon star"></PhStar>
                                <span>{{ item.rating }} / 5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- TODO: ReMine 추천작 -->
            <h3 class="title">리뷰를 분석해봤어요 👀</h3>
            <p class="description">내가 남긴 리뷰에서 취향을 찾아봤어요.</p>
            <!-- TODO: TMDB 인기작 + 장르로 가져올 수 있는지 -->
            <h3 class="title">아직 뭘 볼지 고민이라면? 📽</h3>
            <p class="description">요즘 사람들이 많이 본 작품을 모아왔어요.</p>
            <!-- TODO: YouTube Playlists -->
            <h3 class="title">궁금했던 그 작품, 바로 찾아보세요 🔍</h3>
            <p class="description">유튜브 플레이리스트 속 작품도 손쉽게 찾아드려요.</p>
        </div>
    </section>
</template>

<style>
.home-section .frame {
    margin-bottom: 30px;
}

.home-section .recent-reviews-container {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-right: 20px;
    cursor: grab;
}

.home-section .recent-reviews-container:active {
    cursor: grabbing;
}

.home-section .recent-reviews-container .review-card {
    width: 40%;
    max-width: 230px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 8px;
}

.home-section .recent-reviews-container .review-info-box {
    display: flex;
    justify-content: end;
    align-items: start;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    padding: 0 0 4% 6%;
    color: var(--text-static-wh);
    background: linear-gradient(to top,
            var(--text-static-bk) 0%,
            var(--text-static-bk) 25%,
            transparent 100%);
}

.home-section .recent-reviews-container .review-info-box>div {
    display: flex;
    gap: 6px;
    align-items: center;
}
</style>