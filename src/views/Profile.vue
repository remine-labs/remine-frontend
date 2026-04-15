<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { api } from '../api/client';

interface HistoryItem {
    reviewId: number,
    workTitle: string,
    workPosterPath: string,
    startDate: string
}

const now = new Date()
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)

const historyList = ref<HistoryItem[]>([])

const getHistory = async () => {
    try {
        const res = await api.get('/api/users/history', {
            params: {
                year: year.value,
                month: month.value,
            }
        })
        historyList.value = res.data
        console.log(res.data)
        console.log(res.request?.responseURL)
        console.log(res.headers['content-type'])
    } catch (error) {
        console.error('history 조회 실패', error)
    }
}

onMounted(() => {
    getHistory()
})
</script>

<template>
    <section class="profile-section">
        <div class="wrap">
            <div class="user-container">
                <div class="user-info-box">
                    <div class="img-box profile-img">
                        img
                    </div>
                    <p class="username">username</p>
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
                    <div class="date-box" v-for='item in historyList' :key='item.reviewId'>
                        <p class="star-date">{{ item.startDate }}</p>
                        <p class="work-title">{{ item.workTitle }}</p>
                        <div class="img-box work-poster">
                            <img :src="`https://image.tmdb.org/t/p/w200${item.workPosterPath}`" :alt='item.workTitle'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>