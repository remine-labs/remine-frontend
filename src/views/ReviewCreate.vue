<script setup lang="ts">
import { ref } from 'vue'
import { api } from '../api/client'

const rating = ref<number>(0)
const startDate = ref('')
const endDate = ref('')
const isWatching = ref(false)
const isSameStartDate = ref(false)
const comment = ref('')
const videoId = 838209 // TMDB에서 파묘 id 값
// 기생충 id 값 496243

const submitReview = async () => {
    const body = {
        videoId,
        comment: comment.value,
        startDate: startDate.value,
        endDate: endDate.value || null,
    }

    console.log(body)

    try {
        const res = await api.post('/api/reviews', body)
        console.log("응답", res.data)

    } catch (err) {
        console.error("에러", err)
    }
}

</script>

<template>
    <section class="review-create-section">
        <div class="wrap">
            <div class="work-info-container">
                <div class="img-box">
                    poster
                </div>
                <div class="info-text-box">
                    <p class="release-date">YY.MM.DD</p>
                    <p class="genre">genre</p>
                    <div class="actor-box">
                        <span class="actor-name">actor 1</span>
                        <span class="actor-name">actor 2</span>
                    </div>
                    <div class="story-box toggle">
                        <button type='button' class="open-story-btn">
                            펼쳐보기
                        </button>
                        <div class="story-text">
                            <p class="story">story</p>
                        </div>
                    </div>
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
                    <button type="submit" id='post-review-btn'>save</button>
                </div>
            </form>
        </div>
    </section>
</template>