<script setup lang="ts">
import { ref, watch } from 'vue'
import { api } from '../api/client'
import { useRouter } from 'vue-router'
import Datepicker from 'vue3-datepicker'
import { PhStar } from '@phosphor-icons/vue'


const router = useRouter()
const work = history.state


// 감상일 관련
const now = new Date()
const startDate = ref<Date>(now)
const endDate = ref<Date | undefined>(now)
const formatDate = (date?: Date) => {
    if (!date) return null
    return date.toISOString().slice(0, 10)
}
const isWatching = ref(false)

// 감상중 체크
watch(isWatching, (val) => {
    if (val) {
        endDate.value = undefined
    } else {
        endDate.value = startDate.value
    }
})

// 시작일 변경
watch(startDate, (newStart) => {
    if (isWatching.value) return

    if (!endDate.value) {
        endDate.value = newStart
        return
    }

    const today = new Date()

    if (endDate.value.toDateString() === today.toDateString()) {
        endDate.value = newStart
    }

    if (endDate.value < newStart) {
        endDate.value = newStart
    }
})

// 종료일 변경 보정
watch(endDate, (newEnd) => {
    if (!newEnd || isWatching.value) return

    if (newEnd < startDate.value) {
        endDate.value = startDate.value
    }
})

// 별점 입력
const rating = ref(0)
const ratingBoxRef = ref<HTMLElement | null>(null)

const getStarFill = (i: number) => {
    if (rating.value >= i) return '100%'
    if (rating.value >= i - 0.5) return '50%'
    return '0%'
}

const handleRatingClick = (e: MouseEvent) => {
    if (!ratingBoxRef.value) return

    const rect = ratingBoxRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / rect.width

    const raw = ratio * 5
    const value = Math.ceil(raw * 2) / 2

    rating.value = Math.min(5, Math.max(0, value))
}

const comment = ref('')

const submitReview = async () => {
    // TODO: 작품 정보 직접 등록시 수정해야 할 부분
    if (!work?.id) {
        console.error('작품 정보가 없습니다.')
        return
    }

    const body = {
        workId: work.id,
        workTitle: work.title,
        workPosterPath: work.poster_path,
        releaseDate: work.release_date,
        comment: comment.value.trim(),
        rating: rating.value,
        startDate: formatDate(startDate.value),
        endDate: isWatching.value ? null : formatDate(endDate.value),
    }

    console.log(body)

    try {
        const res = await api.post('/api/reviews', body)
        const reviewId = res.data.data.reviewId
        alert('저장되었습니다. 리뷰 페이지로 이동합니다.')
        router.push({
            name: 'reviewDetail',
            params: { reviewId: reviewId },
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

        alert(`저장 실패\n${errorMsg}`)
    }
}

</script>

<template>
    <section class="review-create-section">
        <div class="work-info-container relative" v-if="work">
            <div class="img-box">
                <img :src="`https://image.tmdb.org/t/p/original${work.poster}`" :alt="work.title" />
            </div>
            <div class="overlay-box"></div>
        </div>
        <div class="wrap">
            <form @submit.prevent='submitReview'>
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
                                <Datepicker v-model="startDate" inputFormat='yy-MM-dd' />
                            </div>
                            <span> - </span>
                            <div class='date-picker-box'>
                                <span v-if='isWatching'>ING</span>
                                <Datepicker v-else v-model="endDate" inputFormat='yy-MM-dd' />
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
                        <textarea v-model="comment" name="review-write" id="review-write"
                            placeholder="자유롭게 감상을 남겨주세요."></textarea>
                    </div>
                </div>
                <div class="btn-box">
                    <button type="submit" id='post-review-btn' class='active-btn text-btn'>등록하기</button>
                </div>
            </form>
        </div>
    </section>
</template>

<style>
.review-create-section {
    padding-top: 58px;
}

.review-create-section .work-info-container {
    width: 100%;
    aspect-ratio: 3/2;
    overflow: hidden;
}

.review-create-section .work-info-container .img-box {
    margin-top: -15%;
}

.review-create-section .input-container {
    display: flex;
    margin-top: -10%;
    gap: 8px;
}

.review-create-section .input-container>div {
    width: calc(50% - 4px);
    padding: 8px;
    border-radius: 8px;
    background-color: var(--bg-elevated);
    box-shadow: var(--box-default);
    text-align: center;
    ;
}

.review-create-section .input-container p {
    font-weight: 500;
}

.review-create-section .date-input-box .head-box .input-box {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    color: var(--text-sub);
}

.review-create-section .date-input-box .head-box p {
    margin: 0 51px;
}

.review-create-section .date-input-box .body-box {
    margin-top: 6px;
    display: flex;
    gap: 4px;
}

.review-create-section .date-input-box .date-picker-box {
    width: calc(50% - 5.5px);
    font-size: var(--font-size-sub);
}

.review-create-section .date-picker-box span {
    display: flex;
    align-items: center;
    justify-content: center;
}

.review-create-section .date-picker-box input {
    width: 100%;
    text-align: center;
}


.review-create-section .rating-container .rating-box {
    margin-top: 6px;
    display: inline-block;
}

.review-create-section .rating-box .star-box {
    display: inline-block;
    margin: 0 2px;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

.review-create-section .rating-box .star-stroke,
.review-create-section .rating-box .star-fill>svg {
    display: block;
    width: 24px;
    height: 24px;
    color: var(--chip-important-bg);
}

.review-create-section .rating-box .star-fill {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
}

.review-create-section .review-write-container {
    margin-top: 2rem;
}

.review-create-section .review-write-container textarea {
    width: 100%;
    min-height: 250px;
    max-width: auto;
    resize: vertical;
    margin-top: 1rem;
    padding: 6px;
    outline: none;
    white-space: pre-wrap;
}

.review-create-section .btn-box {
    margin-top: 3rem;
    text-align: right;
}
</style>