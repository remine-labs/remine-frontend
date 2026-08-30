<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../api/client'
import { deleteReview } from '../../api/review'
import { PhCalendar, PhDotsThreeVertical, PhPencil, PhStar } from '@phosphor-icons/vue'
import Tooltip from "../../components/Tooltip.vue"

const route = useRoute()
const router = useRouter()
const reviewId = Number(route.params.reviewId)

let pollTimer: ReturnType<typeof setTimeout> | null = null;

interface Tag {
    label: string;
    category: string;
    sentiment: 'POSITIVE' | 'NEGATIVE' | null;
}

export type AiTagStatus =
    | 'NONE'
    | 'PENDING'
    | 'PROCESSING'
    | 'SUCCESS'
    | 'FAILED'

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
    aiTagStatus: AiTagStatus
    tags: Tag[]
}


const review = ref<ReviewDetail | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const goToEdit = () => {
    router.push(`/review/${route.params.reviewId}/edit`)
}

const goToWorkDetail = () => {
    router.push(`/work/${review.value?.mediaType}/${review.value?.workId}`)
}

const getTagSentimentClass = (
    sentiment: 'POSITIVE' | 'NEGATIVE' | null,
) => {
    switch (sentiment) {
        case 'POSITIVE':
            return 'positive';
        case 'NEGATIVE':
            return 'negative';
        default:
            return 'default';
    }
};

const formatDisplayDate = (date: string | Date | null) => {
    if (!date) return 'ING'

    const d = new Date(date)

    const yy = String(d.getFullYear()).slice(2)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')

    return `${yy}.${mm}.${dd}`
}

const pollReview = async () => {
    try {
        const reviewId = route.params.reviewId;
        const res = await api.get(`/api/reviews/${reviewId}`);

        const reviewData = res.data.data;

        review.value = reviewData;

        if (
            reviewData.aiTagStatus === 'PENDING' ||
            reviewData.aiTagStatus === 'PROCESSING'
        ) {
            pollTimer = setTimeout(pollReview, 2000);
        } else {
            pollTimer = null;
        }
    } catch (err) {
        console.error(err);
    }
};

const fetchReviewDetail = async () => {
    try {
        isLoading.value = true
        errorMessage.value = ''

        const reviewId = route.params.reviewId
        const res = await api.get(`/api/reviews/${reviewId}`)

        const reviewData = res.data.data;

        review.value = reviewData;

        if (
            reviewData.aiTagStatus === 'PENDING' ||
            reviewData.aiTagStatus === 'PROCESSING'
        ) {
            pollReview();
        }

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

onUnmounted(() => {
    if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
    }
});
</script>

<template>
    <section class="review-detail-section">
        <div v-if="isLoading">로딩 중...</div>
        <div v-else-if="errorMessage">{{ errorMessage }}</div>

        <template v-else-if="review">
            <div class="work-info-container relative">
                <div class="img-box add-overlay">
                    <img :src="`https://image.tmdb.org/t/p/original${review.workPosterPath}`" :alt="review.workTitle" />
                </div>
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
                    <div class="rating-box">
                        <span class="icon">
                            <PhStar :size='24'></PhStar>
                        </span>
                        <div class="rated-point-box description">
                            {{ review.rating }}
                            <span class="rating-standard">/5</span>
                        </div>
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
                    <div class="created-at-box">
                        <span class="icon">
                            <PhPencil :size="24"></PhPencil>
                        </span>
                        <p class="created-at description">{{ formatDisplayDate(review.createdAt) }}</p>
                    </div>
                </div>
                <div class="comment-container">
                    <div class="text-box" :class="{ 'state-null': !review.comment }">
                        <template v-if="review.comment">
                            {{ review.comment }}
                        </template>
                        <template v-else>
                            <p>작성된 내용이 없어요.</p>
                            <p>리뷰를 일정 길이 이상 작성하면,</p>
                            <p>AI가 분석하여 태그를 만들어드려요.</p>
                        </template>
                    </div>
                </div>

                <div class="tags-container">
                    <!-- TODO: 태그 종류마다 툴팁 노출
                         AI: 작성한 리뷰를 기반으로 추출한 태그, 작품 추천에 활용됨
                         리뷰 수정 시, 태그가 수정될 수도 있음
                         MANUAL: AI 분석 요구가 불가능한 경우,
                         운영 환경상 일시적으로 생성 불가한 경우, 임시 사용될 수 있음 -->
                    <div class="head-box">
                        <template v-if="review.aiTagStatus === 'NONE'">
                            <div class="title-box">
                                <h3>내가 선택한 태그</h3>
                                <Tooltip type="info"
                                    :text="['태그 생성이 어려운 경우, 태그를 직접 선택할 수 있습니다.', '- 리뷰가 짧아 분석이 어려운 경우', '- 태그 생성에 문제가 발생한 경우']" />
                            </div>
                            <!-- TODO: 유저가 선택한 태그 노출 -->
                        </template>

                        <template v-else>
                            <div class="title-box">
                                <h3>AI 태그</h3>
                                <Tooltip type="info" :text="[
                                    '작성한 리뷰에서 추출한 키워드로, 작품 추천에 활용됩니다.',
                                    '리뷰 수정 시, 태그가 변경될 수 있습니다.'
                                ]" />
                            </div>
                            <!-- TODO: AI 태그 만족도 조사 modal
                             태그 생성된 시점 이후 1회만 노출 -->
                            <div class="satisfaction-rate-box">
                                <button>AI 태그 만족도 평가</button>
                            </div>
                        </template>
                    </div>
                    <div class="tags-box chips">
                        <template v-if="review.aiTagStatus === 'PENDING' || review.aiTagStatus === 'PROCESSING'">
                            <span class="skeleton"></span>
                            <span class="skeleton"></span>
                            <span class="skeleton"></span>
                            <span class="skeleton"></span>
                        </template>
                        <template v-else-if="review.tags?.length">
                            <span v-for="tag in review.tags" :key="tag.label" class="tag-item chip default"
                                :class="getTagSentimentClass(tag.sentiment)">
                                {{ tag.label }}
                            </span>
                        </template>
                        <template v-else-if="review.aiTagStatus === 'FAILED'">
                            AI 태그 생성에 실패했습니다.
                            <div class="btn-box">
                                <button class='active-btn'>재시도</button>
                            </div>
                        </template>
                        <span v-else>생성된 태그가 없어요.</span>
                    </div>
                </div>
            </div>
        </template>
    </section>
</template>

<style>
.review-detail-section {
    padding-top: var(--header-height);
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


.review-detail-section .comment-container .state-null {
    text-align: center;
    padding: 40px 0;
}

.review-detail-section .tags-container {
    margin-top: 40px;
}

.review-detail-section .tags-container .head-box {
    display: flex;
    justify-content: space-between;
}

.review-detail-section .tags-container .head-box .title-box {
    display: flex;
    gap: 6px;
    align-items: center;
}

.review-detail-section .tooltip .tooltip-content {
    max-width: 320px;
}

.review-detail-section .tags-box {
    margin-top: 12px;
}

.review-detail-section .tags-box .skeleton {
    width: 60px;
    height: 22px;
    border-radius: 5px;
    margin-right: 2px;
    background: linear-gradient(120deg,
            #d6d6d6 25%,
            #e5e5e5 50%,
            #d6d6d6 75%);
    background-size: 250% 100%;
    animation: skeleton-shimmer 4s infinite linear;
}

.review-detail-section .tags-box .tag-item.positive:before,
.review-detail-section .tags-box .tag-item.negative:before {
    display: inline-block;
    margin-right: 4px;
}

.review-detail-section .tags-box .tag-item.positive:before {
    content: '▲';
    color: var(--success);
}

.review-detail-section .tags-box .tag-item.negative:before {
    content: '▼';
    color: var(--error);
}

.review-detail-section .tags-container .head-box p button {
    margin-left: 8px;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}


@media screen and (min-width: 520px) {
    .review-detail-section .work-info-container {
        aspect-ratio: 3 / 2;
    }

    .review-detail-section .work-info-container .img-box {
        margin-top: -10%;
    }
}

@media screen and (min-width: 640px) {
    .review-detail-section .work-info-container {
        aspect-ratio: 5 / 3;
    }
}
</style>