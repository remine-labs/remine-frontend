<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api/client'

const route = useRoute()
const router = useRouter()

const review = ref<ReviewDetail | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const goToEdit = () => {
    router.push(`/review/${route.params.reviewId}/edit`)
}

export interface ReviewDetail {
    reviewId: number
    workId: number
    workTitle: string
    workPosterPath: string
    releaseDate: String
    comment: string
    rating: number
    startDate: string
    endDate: string | null
    createdAt: string
    updatedAt: string
    tags: string[]
}

const fetchReviewDetail = async () => {
    try {
        isLoading.value = true
        errorMessage.value = ''

        const reviewId = route.params.reviewId
        const res = await api.get(`/api/reviews/${reviewId}`)

        review.value = res.data.data

        history.replaceState(
            {
                ...history.state,
                headerTitle: res.data.data.workTitle
            },
            ''
        )
    } catch (err: any) {
        if (err.response) {
            errorMessage.value = `${err.response.status} - ${err.response.data?.message || '서버 오류'}`
        } else if (err.request) {
            errorMessage.value = '서버 응답 없음 (네트워크 문제)'
        } else {
            errorMessage.value = err.message
        }

        alert(`리뷰 조회 실패\n${errorMessage.value}`)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchReviewDetail()
})
</script>

<template>
    <section class="review-read-section">
        <div class="wrap">
            <div v-if="isLoading">로딩 중...</div>
            <div v-else-if="errorMessage">{{ errorMessage }}</div>

            <template v-else-if="review">
                <div class="work-info-container">
                    <div class="img-box">
                        <img :src="`https://image.tmdb.org/t/p/w200${review.workPosterPath}`" :alt="review.workTitle" />
                    </div>
                    <div class="info-text-box">
                        <p class="work-title">{{ review.workTitle }}</p>
                        <p class="release-date">{{ review.releaseDate }}</p>
                    </div>
                </div>

                <div class="review-container">
                    <div class="date-box">
                        <h2 class="description">watch date</h2>
                        <div class="start-date-box">
                            {{ review.startDate }}
                        </div>
                        <div class="end-date-box">
                            {{ review.endDate }}
                        </div>
                    </div>

                    <div class="rating-box">
                        {{ review.rating }}
                    </div>

                    <div class="review-text-box">
                        {{ review.comment }}
                    </div>
                </div>

                <div class="tags-container">
                    <h3 class="description">Tags Type</h3>
                    <div class="tags-box" v-if='review?.tags?.length'>
                        <span v-for="tag in review.tags" :key="tag" class="tag-item">
                            {{ tag }}
                        </span>
                    </div>
                </div>

                <div class="tag-feedback-container">
                    <h4 class="description">feedback</h4>
                    <div class="btn-box">
                        <button>만족해요</button>
                        <button>아쉬워요</button>
                    </div>
                </div>
            </template>
            <div class="btn-box">
                <button id='review-edit-btn' @click='goToEdit'>edit</button>
            </div>
        </div>
    </section>
</template>