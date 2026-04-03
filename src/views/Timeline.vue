<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api/client'

const router = useRouter()
const currentPage = ref(0)
const loading = ref(false)
const timeline = ref<Review[]>([])

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

const toGoReviewDetail = (reviewId: number) => {
    router.push(`/review/${reviewId}`)
}

interface Review {
    reviewId: number
    workId: number
    workTitle: string
    workPosterPath: string
    releaseDate: string
    comment: string
    rating: number
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}
</script>

<template>
    <section class="timeline-section">
        <div class="wrap">
            <div class="filter-container">
                <div class="filter-box sort-date">
                    <button>최신 순</button>
                    <button>오래된 순</button>
                    <button>감상일 순</button>
                </div>
                <div class="filter-box sort-rating">
                    <button>4점 이상</button>
                    <button>3점 이상</button>
                    <button>2점 이상</button>
                    <button>1점 이상</button>
                    <button>1점 미만</button>
                </div>
            </div>
            <div class="timeline-container">
                <div class="timeline-box" v-for="item in timeline" :key="item.reviewId"
                    @click='toGoReviewDetail(item.reviewId)'>
                    <div class="img-box">
                        <img :src="`https://image.tmdb.org/t/p/w200${item.workPosterPath}`" :alt="item.workTitle" />
                    </div>

                    <div class="work-info-box">
                        <h3 class='work-title'>{{ item.workTitle }}</h3>
                        <span class="release-year">
                            ({{ item.releaseDate?.slice(0, 4) }})
                        </span>
                    </div>

                    <div class="review-text-box ellipsis-3">
                        {{ item.comment }}
                    </div>

                    <div class="rating-box">
                        ⭐ {{ item.rating }}
                    </div>

                    <div class="creation-information-box">
                        <div class="tags-box">
                            <!-- TODO: tags 연결 -->
                        </div>
                        <div class="created-date">
                            {{ item.createdAt?.slice(0, 10) }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="pagination-container">
                <button @click="fetchTimeline(currentPage - 1)" :disabled="currentPage === 0">
                    이전
                </button>

                <button @click="fetchTimeline(currentPage + 1)">
                    다음
                </button>
            </div> -->
        </div>
    </section>
</template>

<style>
.timeline-section .timeline-container .timeline-box {
    cursor: pointer;
}
</style>