<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../api/client'
import { deleteReview } from '../../api/review'
import { PhCalendar, PhDotsThreeVertical, PhInfo, PhStar } from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()
const reviewId = Number(route.params.reviewId)

const review = ref<ReviewDetail | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const goToEdit = () => {
    router.push(`/review/${route.params.reviewId}/edit`)
}

const goToWorkDetail = () => {
    router.push(`/work/${review.value?.mediaType}/${review.value?.workId}`)
}

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

export interface ReviewDetail {
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

const formatDisplayDate = (date: string | Date | null) => {
    if (!date) return 'ING'

    const d = new Date(date)

    const yy = String(d.getFullYear()).slice(2)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')

    return `${yy}.${mm}.${dd}`
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

const handleDeleteReview = async () => {
    const ok = confirm('리뷰를 삭제하시겠습니까?')

    if (!ok) return

    try {
        await deleteReview(reviewId)

        alert('리뷰가 삭제되었습니다.')

        router.push({
            name: 'timeline'
        })
    } catch (err: any) {
        let errorMsg = '알 수 없는 오류'

        if (err.response) {
            const status = err.response.status

            if (status === 403) {
                errorMsg = '삭제할 리뷰를 다시 확인해주세요.'
            } else if (status === 404) {
                errorMsg = '로그인 정보를 확인해주세요.'
            } else {
                errorMsg = err.response.data?.message || '서버 오류'
            }
        } else if (err.request) {
            errorMsg = '서버 응답 없음 (네트워크 문제)'
        } else {
            errorMsg = err.message
        }

        alert(`삭제 실패\n${errorMsg}`)
    }
}

onMounted(() => {
    fetchReviewDetail()
})
</script>

<template>
    <section class="review-detail-section">
        <div v-if="isLoading">로딩 중...</div>
        <div v-else-if="errorMessage">{{ errorMessage }}</div>

        <template v-else-if="review">
            <div class="work-info-container relative">
                <div class="img-box">
                    <img :src="`https://image.tmdb.org/t/p/original${review.workPosterPath}`" :alt="review.workTitle" />
                </div>
                <div class="overlay-box"></div>
                <div class="icon-box" @click='toggleMenu'>
                    <PhDotsThreeVertical :size='30'></PhDotsThreeVertical>
                </div>
                <div class="modal-menu-box" :class='{ active: isMenuOpen }'>
                    <p @click='goToWorkDetail'>작품 상세보기</p>
                    <p @click='goToEdit'>수정</p>
                    <p @click='handleDeleteReview'>삭제</p>
                </div>
            </div>
            <div class="wrap">
                <div class="meta-container relative">
                    <div class="info-box">
                        <span class="icon">
                            <PhInfo :size='24'></PhInfo>
                        </span>
                        <p class="release-date description">{{ formatDisplayDate(review.workReleaseDate) }}</p>
                    </div>
                    <div class="watch-period-box">
                        <span class="icon">
                            <PhCalendar :size='24'></PhCalendar>
                        </span>
                        <div class="date-box description">
                            <div class="start-date-box">
                                {{ formatDisplayDate(review.startDate) }}
                            </div>
                            <span>~</span>
                            <div class="end-date-box">
                                {{ formatDisplayDate(review.endDate) }}
                            </div>
                        </div>
                    </div>
                    <div class="rating-box">
                        <span class="icon">
                            <PhStar :size='24'></PhStar>
                        </span>
                        <div class="rated-point-box description">
                            {{ review.rating }}
                            <span class="rating-standard">/5</span>
                        </div>
                    </div>
                </div>
                <div class="comment-container">
                    <div class="text-box">
                        {{ review.comment }}
                    </div>
                    <p class="created-at number">{{ formatDisplayDate(review.createdAt) }}</p>
                </div>

                <div class="tags-container">
                    <div class="head-box">
                        <h3 class="description">Tags Type</h3>
                        <p>생성된 태그가 만족스러웠나요? <button>평가하기</button></p>
                    </div>
                    <div class="tags-box chips" v-if='review?.tags?.length'>
                        <span v-for="tag in review.tags" :key="tag" class="tag-item chip default">
                            {{ tag }}
                        </span>
                    </div>
                    <span v-else>생성된 태그가 없어요.</span>
                </div>
            </div>
        </template>
    </section>
</template>

<style>
.review-detail-section {
    padding-top: 58px;
    padding-bottom: 160px;
}

.review-detail-section .work-info-container {
    aspect-ratio: 1/1;
    overflow: hidden;
}

.review-detail-section .work-info-container .img-box {
    margin-top: -5%;
}

.review-detail-section .work-info-container .icon-box {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #f6f4f0;
    z-index: 10;
    cursor: pointer;
}

.review-detail-section .work-info-container .modal-menu-box {
    position: absolute;
    top: 46px;
    right: 16px;
    background-color: var(--bg-elevated);
    padding: 10px;
    border-radius: 8px;
    transition: opacity 0.2s ease;
    opacity: 0;
    pointer-events: none;
}

.review-detail-section .work-info-container .modal-menu-box.active {
    opacity: 1;
    pointer-events: auto;
}

.review-detail-section .work-info-container .modal-menu-box p {
    margin-bottom: 4px;
    cursor: pointer;
    ;
}

.review-detail-section .work-info-container .modal-menu-box p:last-child {
    color: var(--error);
    margin-bottom: 0;
}

.review-detail-section .meta-container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 8px;
    text-align: center;
    margin-top: -30px;
}

.review-detail-section .meta-container>div {
    border-radius: 8px;
    background-color: var(--bg-elevated);
    box-shadow: var(--box-default);
    padding: 8px;
}

.review-detail-section .meta-container .icon {
    display: inline-block;
    color: var(--text-icon);
    margin-bottom: 2px;
}

.review-detail-section .watch-period-box .date-box {
    display: flex;
    gap: 2px;
    justify-content: center;
}

.review-detail-section .rating-box .rating-standard {
    color: var(--text-sub);
}

.review-detail-section .comment-container {
    margin-top: 30px;
}

.review-detail-section .comment-container .text-box {
    font-size: var(--font-size-long);
    color: var(--text-sub);
    text-align: justify;
    white-space: pre-wrap;
    border-radius: 8px;
    background-color: var(--bg-surface);
    padding: 12px;
    box-shadow: var(--box-default)
}

.review-detail-section .comment-container .created-at {
    text-align: right;
    margin: 4px 6px 0 0;
}

.review-detail-section .tags-container {
    margin-top: 40px;
}

.review-detail-section .tags-container .head-box {
    display: flex;
    justify-content: space-between;
}

.review-detail-section .tags-box {
    margin-top: 12px;
}

.review-detail-section .tags-container .head-box p button {
    margin-left: 8px;
}
</style>