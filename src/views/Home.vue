<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMe, type MeResponse } from '../api/auth'
import { api } from '../api/client'
import { PhPencil, PhStar } from "@phosphor-icons/vue"
import WorkCard from "../components/WorkCard.vue"

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

interface TrendingWork {
    workId: number
    workTitle: string
    workPosterPath: string
    workReleaseDate: string
    mediaType: string
}

const trendingWorks = ref<TrendingWork[]>([])

const currentPage = ref(0)
const loading = ref(false)
const timeline = ref<Review[]>([])

const user = ref<MeResponse | null>(null)

const container = ref<HTMLElement | null>(null)

const activeTab = ref<'movie' | 'tv'>('movie')

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

const fetchUser = async () => {
    try {
        user.value = await getMe()
        console.log('user:', user.value)

        fetchTimeline(0)
    } catch (error) {
        console.log('getMe 실패:', error)
        user.value = null
    }
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

const fetchTrending = async (mediaType: 'movie' | 'tv') => {
    try {
        const res = await api.get(`/api/tmdb/contents/trending/${mediaType}`)
        trendingWorks.value = res.data.data.results
    } catch (error) {
        console.error('인기작 조회 실패', error)
        trendingWorks.value = []
    }
}



onMounted(() => {
    fetchUser()
    fetchTrending('movie')
})
</script>

<template>
    <section class="home-section">
        <div class="wrap">
            <div class="personalized-container">
                <h3 class="title">최근에 어떤 리뷰를 썼을까요?✏</h3>

                <!-- 로그인 상태 -->
                <div v-if="user" class="frame">
                    <div ref="container" class="recent-reviews-container" @mousedown="handleMouseDown"
                        @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
                        <div v-for="item in timeline.slice(0, 3)" :key="item.reviewId" class="review-card relative"
                            @click="goToReviewDetail(item.reviewId)">
                            <div class="img-box">
                                <img :src="`https://image.tmdb.org/t/p/w200${item.workPosterPath}`"
                                    :alt="`${item.workTitle} 포스터`">
                            </div>

                            <div class="review-info-box">
                                <div class="created-date">
                                    <PhPencil class="icon pencil" />
                                    <span>{{ formatRelativeDate(item.createdAt) }}</span>
                                </div>

                                <div class="rating">
                                    <PhStar class="icon star" />
                                    <span>{{ item.rating }} / 5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 비로그인 상태 -->
                <div v-else class="login-prompt">
                    <p>
                        <RouterLink to="/login">로그인</RouterLink>하고 리뷰를 작성해보세요.
                    </p>
                    <p>AI가 태그를 생성해드립니다.</p>
                </div>
            </div>
            <!-- TODO: ReMine 추천작 -->
            <div v-if="user" class="remine-recommend-container">
                <h3 class="title">리뷰를 분석해봤어요 👀</h3>
                <p class="description">내가 남긴 리뷰에서 취향을 찾아봤어요.</p>
            </div>
            <!-- TODO: TMDB 인기작 + 장르로 가져올 수 있는지 -->
            <div class="tmdb-trending-container">
                <h3 class="title">아직 뭘 볼지 고민이라면? 📽</h3>
                <p class="description">요즘 사람들이 많이 본 작품을 모아왔어요.</p>
                <div class="tabs">
                    <button class="tab" :class="{ active: activeTab === 'movie' }"
                        @click="activeTab = 'movie'; fetchTrending('movie')">
                        영화
                    </button>
                    <button class="tab" :class="{ active: activeTab === 'tv' }"
                        @click="activeTab = 'tv'; fetchTrending('tv')">
                        TV
                    </button>
                </div>
                <div class="works-list-container">
                    <WorkCard v-for="work in trendingWorks.slice(0, 6)" :key="work.workId" :work-id="work.workId"
                        :work-poster-path="work.workPosterPath" :work-title="work.workTitle"
                        :work-release-date="work.workReleaseDate" :media-type="work.mediaType" />
                </div>
            </div>
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

.home-section .login-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-self: center;
    padding: 60px 0;

    a {
        color: var(--color-brand);
        font-weight: bold;
        font-family: var(--font-family-logo);
        font-size: var(--font-size-title)
    }
}


.home-section .tmdb-trending-container {
    .tabs {
        display: flex;
        gap: 8px;
        align-items: center;
        margin: 10px 0;

        .tab {
            background-color: var(--chip-default-bg);
            padding: 4px;
            min-width: 60px;
            border-radius: 12px;
            transition: 0.3s ease-in-out;

            &.active {
                background-color: var(--btn-active-bg);
                color: var(--text-inverse);
                font-weight: 500;
            }
        }
    }
}
</style>