<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { getMe, type MeResponse } from "../api/auth"
import { api } from '../api/client'
import router from '../router';

const user = ref<MeResponse | null>(null);

const toGoReviewDetail = (reviewId: number) => {
    router.push(`/review/${reviewId}`)
}

interface HistoryItem {
    reviewId: number,
    workTitle: string,
    workPosterPath: string,
    startDate: string
}

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)

const historyList = ref<HistoryItem[]>([])

const getHistory = async () => {
    try {
        const res = await api.get('/api/users/history', {
            params: {
                year: year.value,
                month: month.value,
            }
        })
        historyList.value = res.data.data
        console.log(res.data)
        console.log(res.request?.responseURL)
        console.log(res.headers['content-type'])
    } catch (error) {
        console.error('history 조회 실패', error)
    }
}

<<<<<<< HEAD
<<<<<<< HEAD
onMounted(async () => {
    getHistory();
=======
onMounted(() => {
    getHistory()
})

onMounted(async () => {
>>>>>>> c5f0c50 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
=======
onMounted(async () => {
    getHistory();
>>>>>>> b422ed5 (:bug: profile fix: 코드 리뷰 기반 수정)
    try {
        user.value = await getMe();
    } catch (err) {
        console.error(err);
    }
});
</script>

<template>
    <section class="profile-section">
        <div class="wrap">
            <div class="user-container" v-if='user'>
                <div class="user-info-box">
                    <div class="img-box profile-img">
                        img
                    </div>
                    <p class="username">{{ user.name }}</p>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <<<<<<< HEAD </template>

<style>
.profile-section .date-box {
    cursor: pointer;
}
<<<<<<< HEAD
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> c5f0c50 (:sparkles: profile feat: profile 화면에 username 노출 및 작품 포스터 클릭시 해당 작품 리뷰 상세 페이지로 연결)
=======
</style>
>>>>>>> cb61985 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
