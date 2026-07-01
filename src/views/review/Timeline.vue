<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../api/client'

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

const goToReviewDetail = (reviewId: number) => {
    router.push(`/review/${reviewId}`)
}

const formatDisplayDate = (date: string | Date | null) => {
    if (!date) return ''

    const d = new Date(date)

    const yy = String(d.getFullYear()).slice(2)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')

    return `${yy}.${mm}.${dd}`
}

interface Review {
    reviewId: number
    workId: number
    workTitle: string
    workPosterPath: string
    workReleaseDate: string
    mediaType: string
    comment: string
    rating: number
    startDate: string
    endDate: string | null
    createdAt: string
    updatedAt: string
    tags: string[]
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
                    @click='goToReviewDetail(item.reviewId)'>
                    <div class="head-box">
                        <div class="img-box">
                            <img :src="`https://image.tmdb.org/t/p/w200${item.workPosterPath}`" :alt="item.workTitle" />
                        </div>

                        <div class="work-info-box">
                            <h3 class='work-title'>{{ item.workTitle }}</h3>
                            <span class="release-year number">
                                ({{ item.workReleaseDate?.slice(0, 4) }})
                            </span>
                        </div>
                        <div class="created-date number">
                            {{ formatDisplayDate(item.createdAt) }}
                        </div>
                    </div>
                    <div class="review-text-box ellipsis-2">
                        {{ item.comment }}
                    </div>
                    <div class="footer-box chips">
                        <span class="media-type chip important">{{ item.mediaType.toUpperCase() }}</span>
                        <template v-if='item?.tags?.length'>
                            <span v-for="tag in item.tags" :key="tag" class="tag-item chip default">
                                {{ tag }}
                            </span>
                        </template>
                        <span class="rating chip">
                            {{ item.rating }} /5
                        </span>
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
.timeline-section .timeline-container {
    margin: 20px 0;
}

.timeline-section .timeline-box {
    padding: 14px;
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: var(--bg-elevated);
    box-shadow: var(--box-default)
}

.timeline-section .timeline-box .head-box {
    display: flex;
    gap: 6px;
    align-items: center;
}

.timeline-section .timeline-box .head-box .img-box {
    width: 45px;
    height: 45px;
    border-radius: 45px;
    overflow: hidden;
}

.timeline-section .head-box .img-box img {
    margin-top: -10%;
}

.timeline-section .head-box .created-date {
    color: var(--text-sub)
}

.timeline-section .head-box .work-info-box {
    flex-shrink: 0;
    width: calc(100% - 12px - 45px - 54px);
    display: flex;
    align-items: center;
    gap: 4px;
}

.timeline-section .head-box .work-info-box .work-title {
    font-weight: 500;
    font-size: var(--font-size-body);
    max-width: calc(100% - 46px);
}

.timeline-section .timeline-box .review-text-box {
    margin: 16px 0 12px;
    font-size: var(--font-size-long);
    color: var(--text-sub);
}
</style>