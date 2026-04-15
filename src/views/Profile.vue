<script setup lang='ts'>
import { onMounted, ref } from 'vue'
<<<<<<< HEAD
import { getMe, type MeResponse } from "../api/auth"
import { api } from '../api/client'
import router from '../router';

const user = ref<MeResponse | null>(null);

const toGoReviewDetail = (reviewId: number) => {
    router.push(`/review/${reviewId}`)
}
=======
import { api } from '../api/client';
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))

interface HistoryItem {
    reviewId: number,
    workTitle: string,
    workPosterPath: string,
    startDate: string
}

const now = new Date()
<<<<<<< HEAD
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)
=======
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))

const historyList = ref<HistoryItem[]>([])

const getHistory = async () => {
    try {
        const res = await api.get('/api/users/history', {
            params: {
                year: year.value,
                month: month.value,
            }
        })
<<<<<<< HEAD
        historyList.value = res.data.data
=======
        historyList.value = res.data
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
        console.log(res.data)
        console.log(res.request?.responseURL)
        console.log(res.headers['content-type'])
    } catch (error) {
        console.error('history 조회 실패', error)
    }
}

<<<<<<< HEAD
onMounted(async () => {
    getHistory();
    try {
        user.value = await getMe();
    } catch (err) {
        console.error(err);
    }
});
=======
onMounted(() => {
    getHistory()
})
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
</script>

<template>
    <section class="profile-section">
        <div class="wrap">
<<<<<<< HEAD
            <div class="user-container" v-if='user'>
=======
            <div class="user-container">
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
                <div class="user-info-box">
                    <div class="img-box profile-img">
                        img
                    </div>
<<<<<<< HEAD
                    <p class="username">{{ user.name }}</p>
=======
                    <p class="username">username</p>
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
                    <button>edit</button>
                </div>
                <button>setting</button>
            </div>
            <div class="calendar-container">
                <div class="calendar-header">
                    <input type="number" v-model="year" />
                    <input type="number" v-model="month" />
                    <button class='active-btn' @click='getHistory'>조회</button>
                </div>
                <div class="calendar-body">
<<<<<<< HEAD
                    <div class="date-box" v-for='item in historyList' :key='item.reviewId'
                        @click='toGoReviewDetail(item.reviewId)'>
                        <p class="start-date">{{ item.startDate }}</p>
                        <p class="work-title">{{ item.workTitle }}</p>
                        <div class="img-box work-poster">
                            <img v-if="item.workPosterPath"
                                :src="'https://image.tmdb.org/t/p/w200' + item.workPosterPath" :alt='item.workTitle'>
=======
                    <div class="date-box" v-for='item in historyList' :key='item.reviewId'>
                        <p class="star-date">{{ item.startDate }}</p>
                        <p class="work-title">{{ item.workTitle }}</p>
                        <div class="img-box work-poster">
                            <img :src="`https://image.tmdb.org/t/p/w200${item.workPosterPath}`" :alt='item.workTitle'>
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
<<<<<<< HEAD
</template>

<style>
.profile-section .date-box {
    cursor: pointer;
}
</style>
=======
</template>
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
