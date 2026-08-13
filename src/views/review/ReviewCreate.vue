<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import Datepicker from 'vue3-datepicker'
import { PhStar } from '@phosphor-icons/vue'

import { createReview, createTags } from '../../api/review'
import type { ReviewPayload } from '../../api/review'


const router = useRouter()

const work = history.state

const today = new Date()
const startDate = ref<Date>(today)
const endDate = ref<Date | undefined>(today)
const isWatching = ref(false)
const isTagModalOpen = ref(false)


// ref
const rating = ref(0)
const ratingBoxRef = ref<HTMLElement | null>(null);

const selectedCategories = ref<string[]>([]);

const comment = ref('')


const modalDescription = computed(() => {
    return rating.value >= 3 ? '작품의 좋았던 점을 알려주세요.' : '작품의 아쉬웠던 점을 알려주세요.'
})
// Utils
const formatDate = (date?: Date) => {
    if (!date) return null
    return date.toISOString().slice(0, 10)
}

const submitReview = () => {
    const count = comment.value.replace(/\s/g, '').length

    if (count >= 20) {
        processReviewSubmission([])
    } else {
        isTagModalOpen.value = true
    }
}

const submitWithManualTags = () => {
    const sentiment = rating.value >= 3 ? 'POSITIVE' : 'NEGATIVE'
    processReviewSubmission(selectedCategories.value, sentiment)
}


const manualTags = [
    { id: 'STORY', label: '스토리' },
    { id: 'ACTING', label: '연기' },
    { id: 'DIRECTING', label: '연출' },
    { id: 'VISUAL', label: '영상미' },
    { id: 'MUSIC', label: '음악' },
    { id: 'IMMERSION', label: '몰입감' },
    { id: 'PLOT', label: '전개' },
    { id: 'CHARACTER', label: '캐릭터' },
    { id: 'EMOTION', label: '감정' },
    { id: 'AFTERGLOW', label: '여운' },
    { id: 'HUMOR', label: '개그' },
    { id: 'ACTION', label: '액션' }
];

// TODO: custom work로 작성한 리뷰 전송할 방법 필요
const createReviewPayload = (): ReviewPayload => ({
    workId: work.id,
    workTitle: work.title,
    workPosterPath: work.poster,
    workReleaseDate: work.workReleaseDate,
    mediaType: work.mediaType,
    comment: comment.value.trim(),
    rating: rating.value,
    startDate: formatDate(startDate.value)!,
    endDate: isWatching.value ? null : formatDate(endDate.value),
})

const getErrorMessage = (err: any) => {
    if (err.response) {
        return `${err.response.status} - ${err.response.data?.message || '서버 오류'}`
    }

    if (err.request) {
        return '서버 응답 없음 (네트워크 문제)'
    }

    return err.message
}

// Watch

watch(isWatching, (val) => {
    if (val) {
        endDate.value = undefined
    } else {
        endDate.value = startDate.value
    }
})

watch(startDate, (newStart) => {
    if (isWatching.value) return

    if (!endDate.value) {
        endDate.value = newStart
        return
    }

    if (endDate.value.toDateString() === today.toDateString()) {
        endDate.value = newStart
    }

    if (endDate.value < newStart) {
        endDate.value = newStart
    }
})

watch(endDate, (newEnd) => {
    if (!newEnd || isWatching.value) return

    if (newEnd < startDate.value) {
        endDate.value = startDate.value
    }
})

// Rating

const getStarFill = (index: number) => {
    if (rating.value >= index) return '100%'
    if (rating.value >= index - 0.5) return '50%'
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

// API

const processReviewSubmission = async (tags: string[], sentiment?: string) => {
    if (!work?.id) {
        console.error('작품 정보가 없습니다.')
        return
    }

    const body = createReviewPayload()

    try {
        const res = await createReview(body)
        const reviewId = res.data.data.reviewId

        const formattedTags = tags.map(tag => ({
            category: tag,
            sentiment: sentiment!
        }))

        // 3. 태그 등록
        await createTags(reviewId, { tags: formattedTags })

        alert('저장되었습니다. 리뷰 페이지로 이동합니다.')
        router.push({
            name: 'reviewDetail',
            params: { reviewId },
        })
    } catch (err: any) {
        alert(`저장 실패\n${getErrorMessage(err)}`)
    }
}
</script>

<template>
    <section class="review-create-section">
        <div class="work-info-container relative" v-if="work">
            <!-- TODO: 작품 수정하기 버튼 + 작품 수정 modal 추가
             search와 CustomWork를 추가
             search일 경우 빈 값, customWork일 경우 patch 화면 우선 -->

            <div class="img-box add-overlay">
                <!-- TODO: poster 값이 없을 경우, ReMine 로고 작업하여 노출 -->
                <img :src="`https://image.tmdb.org/t/p/original${work.poster}`" :alt="work.title" />
            </div>
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
                        <!-- TODO: 작성한 텍스트 길이에 따라 height 자동 조정 고려 -->
                        <textarea v-model="comment" name="review-write" id="review-write"
                            placeholder="자유롭게 감상을 남겨주세요."></textarea>
                    </div>
                </div>
                <div class="btn-box">
                    <button type="submit" id='post-review-btn' class='active-btn text-btn'>등록하기</button>
                </div>
            </form>
        </div>
        <div class="modal-bg manual-tags-modal" v-if="isTagModalOpen">
            <div class="modal-container">
                <div class="header">
                    <p class="title">작품을 평가해주세요.</p>
                </div>
                <div class="body">
                    <p>{{ modalDescription }} (중복 선택 가능)</p>
                    <div class="tags-container">
                        <div class="input-box" v-for="tag in manualTags" :key="tag.id">
                            <input type="checkbox" :id="tag.id" :value="tag.id" v-model="selectedCategories">
                            <label :for="tag.id">{{ tag.label }}</label>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="btn-box">
                        <button class="close neutral-btn" @click="isTagModalOpen = false">돌아가기</button>
                        <button class="active-btn post-manual-tags" @click="submitWithManualTags">
                            저장하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
/* TODO: ReviewEdit과 css 파일 동일. scoped 안 쓰기 때문에 공통 section 명 추가하여 css 통일 가능
반응형까지 진행하였으나, 차이 없음 */
.review-create-section {
    padding-top: var(--header-height);
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

.manual-tags-modal .body p {
    margin-bottom: 20px;
}

.manual-tags-modal .tags-container .input-box {
    display: inline;
}

.manual-tags-modal .tags-container .input-box input {
    display: none;
}

.manual-tags-modal .tags-container .input-box input[type="checkbox"]:checked+label {
    background-color: var(--chip-important-bg);
    color: var(--text-inverse)
}

.manual-tags-modal .tags-container .input-box label {
    background-color: var(--chip-default-bg);
    white-space: nowrap;
    padding: 2px 12px;
    border-radius: 16px;
    margin: 0 4px 4px 0;
    transition: ease 0.2s;
    cursor: pointer;
}


@media screen and (min-width: 520px) {
    .review-create-section .date-input-box .head-box .input-box {
        gap: 4px;
    }
}

@media screen and (min-width: 600px) {
    .review-create-section .work-info-container {
        aspect-ratio: 9 / 5;
    }

    .review-create-section .input-container {
        margin-top: -6%;
    }
}

@media screen and (min-width: 640px) {
    .review-create-section .work-info-container {
        aspect-ratio: 11 / 5;
    }
}
</style>