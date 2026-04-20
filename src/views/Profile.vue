<script setup lang='ts'>
import { onMounted, ref } from 'vue'
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
import { getMe, type MeResponse } from "../api/auth"
import { api } from '../api/client'
import router from '../router';

const user = ref<MeResponse | null>(null);

const toGoReviewDetail = (reviewId: number) => {
    router.push(`/review/${reviewId}`)
}
<<<<<<< HEAD
=======
import { api } from '../api/client';
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)

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
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))

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
<<<<<<< HEAD
        historyList.value = res.data.data
=======
        historyList.value = res.data
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
        historyList.value = res.data.data
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
        console.log(res.data)
        console.log(res.request?.responseURL)
        console.log(res.headers['content-type'])
    } catch (error) {
        console.error('history 조회 실패', error)
    }
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
onMounted(async () => {
    getHistory();
=======
onMounted(() => {
    getHistory()
})

onMounted(async () => {
<<<<<<< HEAD
>>>>>>> c5f0c50 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
=======
onMounted(async () => {
    getHistory();
>>>>>>> b422ed5 (:bug: profile fix: 코드 리뷰 기반 수정)
=======
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
    try {
        user.value = await getMe();
    } catch (err) {
        console.error(err);
    }
});
<<<<<<< HEAD
=======
onMounted(() => {
    getHistory()
})
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
</script>

<template>
    <section class="profile-section">
        <div class="wrap">
<<<<<<< HEAD
<<<<<<< HEAD
            <div class="user-container" v-if='user'>
=======
            <div class="user-container">
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
            <div class="user-container" v-if='user'>
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
                <div class="user-info-box">
                    <div class="img-box profile-img">
                        img
                    </div>
<<<<<<< HEAD
<<<<<<< HEAD
                    <p class="username">{{ user.name }}</p>
=======
                    <p class="username">username</p>
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
                    <p class="username">{{ user.name }}</p>
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
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
<<<<<<< HEAD
                    <div class="date-box" v-for='item in historyList' :key='item.reviewId'
                        @click='toGoReviewDetail(item.reviewId)'>
<<<<<<< HEAD
<<<<<<< HEAD
                        <p class="start-date">{{ item.startDate }}</p>
=======
                        <p class="star-date">{{ item.startDate }}</p>
>>>>>>> c5f0c50 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
=======
                        <p class="start-date">{{ item.startDate }}</p>
>>>>>>> b422ed5 (:bug: profile fix: 코드 리뷰 기반 수정)
                        <p class="work-title">{{ item.workTitle }}</p>
                        <div class="img-box work-poster">
                            <img v-if="item.workPosterPath"
                                :src="'https://image.tmdb.org/t/p/w200' + item.workPosterPath" :alt='item.workTitle'>
=======
                    <div class="date-box" v-for='item in historyList' :key='item.reviewId'>
=======
                    <div class="date-box" v-for='item in historyList' :key='item.reviewId'
                        @click='toGoReviewDetail(item.reviewId)'>
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
                        <p class="star-date">{{ item.startDate }}</p>
                        <p class="work-title">{{ item.workTitle }}</p>
                        <div class="img-box work-poster">
                            <img :src="`https://image.tmdb.org/t/p/w200${item.workPosterPath}`" :alt='item.workTitle'>
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
</template>

<style>
.profile-section .date-box {
    cursor: pointer;
}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> c5f0c50 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
=======
</style>
>>>>>>> cb61985 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
</template>
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
</style>
>>>>>>> 786b1d2 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
