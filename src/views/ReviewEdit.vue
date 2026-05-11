<script setup lang='ts'>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getReviewDetail, patchReview } from '../api/review'
import Datepicker from 'vue3-datepicker'
import { PhStar } from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()
const reviewId = Number(route.params.reviewId)

type ReviewForm = {
    rating: number
    comment: string
    startDate: Date | undefined
    endDate: Date | undefined
}

const review = ref<ReviewForm>({
    rating: 0,
    comment: '',
    startDate: undefined,
    endDate: undefined,
})

const work = ref({
    id: 0,
    title: '',
    posterPath: '',
    releaseDate: ''
})



// 별점 입력
const ratingBoxRef = ref<HTMLElement | null>(null)

const getStarFill = (index: number) => {
    const rating = review.value.rating

    const diff = rating - (index - 1)

    if (diff >= 1) return '100%'
    if (diff <= 0) return '0%'

    return `${diff * 100}%`
}

const handleRatingClick = (e: MouseEvent) => {
    if (!ratingBoxRef.value) return

    const rect = ratingBoxRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / rect.width

    const raw = ratio * 5
    const value = Math.ceil(raw * 2) / 2

    review.value.rating = Math.min(5, Math.max(0, value))
}


const isWatching = ref(false)

const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 10)
}


watch(isWatching, (newValue, oldValue) => {
    // 감상중 체크
    if (newValue) {
        review.value.endDate = undefined
    }

    // 감상중 해제
    if (oldValue && !newValue) {
        review.value.endDate = new Date()
    }
})

onMounted(async () => {
    const res = await getReviewDetail(reviewId)
    const detail = res.data.data

    review.value = {
        rating: detail.rating,
        comment: detail.comment,
        startDate: detail.startDate ? new Date(detail.startDate) : undefined,
        endDate: detail.endDate ? new Date(detail.endDate) : undefined,
    }

    isWatching.value = !detail.endDate

    work.value = {
        id: detail.workId,
        title: detail.workTitle,
        posterPath: detail.workPosterPath,
        releaseDate: detail.releaseDate
    }

    console.log(detail)
})

const handleEditSubmit = async () => {
    if (!review.value.startDate) {
        alert('감상 시작일을 입력해주세요.')
        return
    }

    try {
        await patchReview({
            reviewId,
            comment: review.value.comment,
            rating: review.value.rating,
            startDate: formatDate(review.value.startDate),
            endDate: review.value.endDate ? formatDate(review.value.endDate) : null,
        })

        alert('수정되었습니다. 리뷰 페이지로 이동합니다.')

        router.push({
            name: 'reviewDetail',
            params: { reviewId }
        })

    } catch (err: any) {
        let errorMsg = '알 수 없는 오류'

        if (err.response) {
            errorMsg = `${err.response.status} - ${err.response.data?.message || '서버 오류'}`
        } else if (err.request) {
            errorMsg = '서버 응답 없음 (네트워크 문제)'
        } else {
            errorMsg = err.message
        }

        alert(`수정 실패\n${errorMsg}`)
    }
}
</script>

<template>
    <section class="review-edit-section">
        <div class="work-info-container relative" v-if="work.id">
            <div class="img-box">
                <img :src="`https://image.tmdb.org/t/p/original${work.posterPath}`" :alt="work.title" />
            </div>
            <div class="overlay-box"></div>
        </div>
        <div class="wrap">
            <form @submit.prevent='handleEditSubmit'>
                <div class="input-container relative">
                    <div class="date-input-box">
                        <div class="head-box relative">
                            <p>감상일</p>
                            <div class="input-box">
                                <input type="checkbox" id="watching" v-model="isWatching">
                                <label for="watching">감상중</label>
                            </div>
                        </div>
                        <div class="body-box">
                            <div class='date-picker-box'>
                                <Datepicker v-model="review.startDate" inputFormat='yy-MM-dd' />
                            </div>
                            <span> - </span>
                            <div class='date-picker-box'>
                                <span v-if='isWatching'>ING</span>
                                <Datepicker v-else='isWatching' v-model="review.endDate" inputFormat='yy-MM-dd' />
                            </div>
                        </div>
                    </div>
                    <div class="rating-container">
                        <p>평점</p>
                        <div class="rating-box" ref="ratingBoxRef" @click="handleRatingClick">
                            <div v-for="i in 5" :key="i" class="star-box relative">
                                <PhStar class="star-stroke" :size="24" />
                                <div class="star-fill" :style="{ width: getStarFill(i) }">
                                    <PhStar class="star-filled" weight="fill" :size="24" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="review-write-container">
                    <div class="input-box">
                        <textarea v-model="review.comment" name="review-write" id="review-write"
                            placeholder="감상을 자유롭게 작성해주세요."></textarea>
                    </div>
                </div>
                <div class="btn-box">
                    <button type="submit" id='patch-review-btn' class='active-btn'>수정하기</button>
                </div>
            </form>
        </div>
    </section>
</template>

<style>
.review-edit-section {
    padding-top: 58px;
}

.review-edit-section .work-info-container {
    width: 100%;
    aspect-ratio: 3/2;
    overflow: hidden;
}

.review-edit-section .work-info-container .img-box {
    margin-top: -15%;
}

.review-edit-section .input-container {
    display: flex;
    margin-top: -10%;
    gap: 8px;
}

.review-edit-section .input-container>div {
    width: calc(50% - 4px);
    padding: 8px;
    border-radius: 8px;
    background-color: var(--bg-elevated);
    box-shadow: var(--box-default);
    text-align: center;
    ;
}

.review-edit-section .input-container p {
    font-weight: 500;
}

.review-edit-section .date-input-box .head-box .input-box {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    color: var(--text-sub);
}

.review-edit-section .date-input-box .body-box {
    margin-top: 6px;
    display: flex;
    gap: 4px;
}

.review-edit-section .date-input-box .date-picker-box {
    width: calc(50% - 5.5px);
    font-size: var(--font-size-sub);
}

.review-edit-section .date-picker-box span {
    display: flex;
    align-items: center;
    justify-content: center;
}

.review-edit-section .date-picker-box input {
    width: 100%;
    text-align: center;
}


.review-edit-section .rating-container .rating-box {
    margin-top: 6px;
    display: inline-block;
}

.review-edit-section .rating-box .star-box {
    display: inline-block;
    margin: 0 2px;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

.review-edit-section .rating-box .star-stroke,
.review-edit-section .rating-box .star-fill>svg {
    display: block;
    width: 24px;
    height: 24px;
    color: var(--chip-important-bg);
}

.review-edit-section .rating-box .star-fill {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
}

.review-edit-section .review-write-container {
    margin-top: 2rem;
}

.review-edit-section .review-write-container textarea {
    width: 100%;
    min-height: 250px;
    resize: vertical;
    margin-top: 1rem;
    padding: 6px;
    outline: none;
    white-space: pre-wrap;
}

.review-edit-section .btn-box {
    margin-top: 3rem;
    text-align: right;
}
</style>