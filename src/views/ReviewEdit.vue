<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getReviewDetail, patchReview } from '../api/review'

const route = useRoute()
const router = useRouter()
const reviewId = Number(route.params.reviewId)

const review = ref({
    rating: 0,
    comment: '',
    startDate: '',
    endDate: '',
})

const work = ref({
    id: 0,
    title: '',
    posterPath: '',
    releaseDate: ''
})


onMounted(async () => {
    const res = await getReviewDetail(reviewId)
    const detail = res.data.data

    review.value = {
        rating: detail.rating,
        comment: detail.comment,
        startDate: detail.startDate,
        endDate: detail.endDate ?? '',
    }

    work.value = {
        id: detail.workId,
        title: detail.workTitle,
        posterPath: detail.workPosterPath,
        releaseDate: detail.releaseDate
    }
})

const handleEditSubmit = async () => {
    try {
        await patchReview({
            reviewId,
            comment: review.value.comment,
            rating: review.value.rating,
            startDate: review.value.startDate,
            endDate: review.value.endDate || null,
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
        <div class="wrap">
            <div class="work-info-container">
                <div class="img-box">
                    <img :src="`https://image.tmdb.org/t/p/w200${work.posterPath}`" :alt="work.title" />
                </div>
                <div class="info-text-box">
                    <p class="work-title">{{ work.title }}</p>
                    <p class="release-date">{{ work.releaseDate }}</p>
                </div>
            </div>
            <form @submit.prevent='handleEditSubmit'>
                <div class="date-input-container">
                    <div class="title-box">
                        <h2 class="description">watch date</h2>
                        <div class="input-box">
                            <input type="checkbox" id="watching">
                            <label for="watching">감상중</label>
                        </div>
                    </div>
                    <div class="start-date-box">
                        <p class="start-date-text">시작일</p>
                        <div class='date-picker-box'><input type="date" v-model="review.startDate"></div>
                    </div>
                    <div class="end-date-box">
                        <p class="end-date-text">종료일</p>
                        <div class='date-picker-box'><input type="date" v-model="review.endDate"></div>
                        <div class="input-box">
                            <input type="checkbox" id="same-start-date">
                            <label for="same-start-date">시작일과 동일</label>
                        </div>
                    </div>
                </div>
                <div class="rating-container">
                    <h2 class="description">rating</h2>
                    <div class="rating-box">
                        <div class="input-box">
                            <input type="number" v-model="review.rating" min="0" max="5" step="0.5" />
                        </div>
                    </div>
                </div>
                <div class="review-write-container">
                    <h2 class="description">textarea review</h2>
                    <div class="input-box">
                        <textarea v-model="review.comment" name="review-write" id="review-write"
                            placeholder="감상을 자유롭게 작성해주세요."></textarea>
                    </div>
                </div>
                <div class="btn-box">
                    <button type="submit" id='patch-review-btn' class='active-btn'>save</button>
                </div>
            </form>
        </div>
    </section>
</template>

<style>
.review-edit-section .review-write-container textarea {
    width: 100%;
    height: 150px;
    resize: vertical;
}
</style>