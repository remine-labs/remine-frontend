<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { getMe, type MeResponse, logout } from "../api/auth"
import { api } from '../api/client'
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter()

const user = ref<MeResponse | null>(null);

const goToWatchlist = () => {
    router.push('/watchlist')
}

// const goToReviewDetail = (reviewId: number) => {
//     router.push(`/review/${reviewId}`)
// }

interface HistoryItem {
    reviewId: number,
    workTitle: string,
    workPosterPath: string,
    startDate: string
}

const currentMonth = ref(dayjs())

const year = ref(currentMonth.value.year())
const month = ref(currentMonth.value.month() + 1)

const daysInMonth = computed(() => currentMonth.value.daysInMonth())

const firstDay = computed(() =>
    currentMonth.value.startOf('month').day()
)

console.log(daysInMonth.value, firstDay.value)

const historyList = ref<HistoryItem[]>([])

const historyMap = ref<Record<number, HistoryItem[]>>({})
const calendarMap = computed(() => historyMap.value)

const getHistory = async () => {
    currentMonth.value = dayjs(`${year.value}-${month.value}-01`)

    try {
        const res = await api.get('/api/users/history', {
            params: {
                year: year.value,
                month: month.value,
            }
        })
        historyList.value = res.data.data

        historyMap.value = {}

        for (const item of historyList.value) {
            const day = Number(item.startDate.slice(-2))

            if (!historyMap.value[day]) {
                historyMap.value[day] = []
            }

            historyMap.value[day].push(item)
        }
        console.log(historyMap.value)
    } catch (error) {
        console.error('history 조회 실패', error)
    }
}

const handleLogout = async () => {
    try {
        await logout();
    } finally {
        router.replace("/");
    }
};

onMounted(async () => {
    getHistory();
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
                        <img :src="user.profileUrl" :alt="`${user.name}의 프로필 이미지`">
                        <!-- TODO: 이미지 값이 null 일 때 대체 이미지 필요 -->
                    </div>
                    <p class="username">{{ user.name }}</p>
                    <button>edit</button>
                </div>
                <div class="btn-box">
                    <button>setting</button>
                </div>
                <div class="btn-box">
                    <button id='logout-btn' @click='handleLogout'>logout</button>
                </div>
            </div>
            <div class="collection-container">
                <div class="created-review-box">
                    작성한 리뷰
                    <p class="count-num">NNN개</p>
                </div>
                <div class="watchlist-box" @click='goToWatchlist'>
                    관심 작품
                    <p class="count-num">NNN개</p>
                </div>
            </div>
            <div class="calendar-container">
                <div class="calendar-header">
                    <!-- TODO: Monthly + 좌우 버튼으로 월 변경 -->
                    <input type="number" v-model="year" />
                    <input type="number" v-model="month" />
                    <button class='active-btn' @click='getHistory'>조회</button>
                </div>
                <div class="weekday">
                    <p>SUN</p>
                    <p>MON</p>
                    <p>TUE</p>
                    <p>WED</p>
                    <p>THU</p>
                    <p>FRI</p>
                    <p>SAT</p>
                </div>
                <div class="calendar-body">
                    <div class="empty-box" v-for="n in firstDay" :key="'empty-' + n" />
                    <div class="date-box" v-for="n in daysInMonth" :key="n">
                        <span class='date'>{{ n }}</span>
                        <div class="poster-box img-box">
                            <img v-if="calendarMap[n]"
                                :src="'https://image.tmdb.org/t/p/w200' + calendarMap[n]?.[0]?.workPosterPath"
                                :alt="calendarMap[n]?.[0]?.workTitle">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.profile-section .user-container {
    display: flex;
}

.profile-section .collection-container {
    display: flex;
    gap: 8px;
    margin-top: 20px;
    text-align: center;
}

.profile-section .collection-container>div {
    width: calc(50% - 4px);
    border-radius: 8px;
    padding: 4px 0;
}

.profile-section .collection-container .count-num {
    font-family: var(--font-family-logo);
    font-size: var(--font-size-title);
}

.profile-section .collection-container .created-review-box {
    background-color: var(--bg-surface);
}

.profile-section .collection-container .watchlist-box {
    background-color: var(--btn-neutral-bg)
}

.profile-section .calendar-container {
    margin-top: 30px;
}

.profile-section .calendar-container .weekday {
    display: flex;
    gap: 4px;
    /* 변경 시 calendar-body의 gap 같이 조정 필요 -> 추후 변수화 예정*/
    font-size: var(--font-size-title);
    font-weight: 400;
    color: var(--text-sub);
    margin: 10px 0;
}

.profile-section .calendar-container .weekday p {
    flex: 1;
    text-align: center;
}

.profile-section .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}

.profile-section .calendar-body .empth-box {
    aspect-ratio: 1 / 1;
}

.profile-section .calendar-body .date-box {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background-color: var(--text-inverse);
}

.profile-section .calendar-body .date {
    position: absolute;
    width: 20px;
    aspect-ratio: 1 / 1;
    top: 3px;
    left: 3px;
    text-align: center;
    font-size: var(--font-size-sub);
    color: var(--text-inverse);
    background-color: var(--text-sub);
    border-radius: 50%;
    z-index: 1;
}

.profile-section .calendar-body .poster-box {
    width: 100%;
    height: 100%;
}

.profile-section .calendar-body .poster-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
</style>
