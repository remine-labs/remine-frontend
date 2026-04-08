<script setup lang="ts">
import { ref } from 'vue'
import { api } from '../api/client'
import { useRouter } from 'vue-router'

const router = useRouter()

const work = history.state.work

console.log('work', work)

const rating = ref<number>(0)
const startDate = ref('')
const endDate = ref('')
const isWatching = ref(false)
const isSameStartDate = ref(false)
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
        startDate: startDate.value,
        endDate: isWatching.value ? null : (endDate.value || null),
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
        <div class="wrap">
            <div class="work-info-container" v-if="work">
                <div class="img-box">
                    <img :src="`https://image.tmdb.org/t/p/w200${work.poster_path}`" :alt="work.title" />
                </div>
                <div class="info-text-box">
                    <p class="work-title">{{ work.title }}</p>
                    <p class="release-date">{{ work.release_date }}</p>
                </div>
            </div>
            <form @submit.prevent='submitReview'>
                <div class="date-input-container">
                    <div class="title-box">
                        <h2 class="description">watch date</h2>
                        <div class="input-box">
                            <input type="checkbox" id="watching" v-model="isWatching">
                            <label for="watching">감상중</label>
                        </div>
                    </div>
                    <div class="start-date-box">
                        <p class="start-date-text">시작일</p>
                        <div class='date-picker-box'><input type="date" v-model="startDate"></div>
                    </div>
                    <div class="end-date-box">
                        <p class="end-date-text">종료일</p>
                        <div class='date-picker-box'><input type="date" v-model="endDate"></div>
                        <div class="input-box">
                            <input type="checkbox" id="same-start-date" v-model="isSameStartDate">
                            <label for="same-start-date">시작일과 동일</label>
                        </div>
                    </div>
                </div>
                <div class="rating-container">
                    <h2 class="description">rating</h2>
                    <div class="rating-box">
                        <div class="input-box">
                            <input type="number" v-model="rating" min="0" max="5" step="0.5" />
                        </div>
                    </div>
                </div>
                <div class="review-write-container">
                    <h2 class="description">textarea review</h2>
                    <div class="input-box">
                        <textarea v-model="comment" name="review-write" id="review-write"
                            placeholder="감상을 자유롭게 작성해주세요."></textarea>
                    </div>
                </div>
                <div class="btn-box">
                    <button type="submit" id='post-review-btn' class='active-btn'>save</button>
                </div>
            </form>
        </div>
    </section>
</template>

<style>
.review-create-section .review-write-container textarea {
    width: 100%;
    height: 150px;
    resize: vertical;
}
</style>