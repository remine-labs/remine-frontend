<script setup lang='ts'>
import Datepicker from 'vue3-datepicker'
import { computed, onMounted, ref, watch } from 'vue'
import { getMe, type MeResponse } from "../../api/auth"
import { api } from '../../api/client'
import { useRouter } from 'vue-router'
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue"
import dayjs from 'dayjs'

const router = useRouter()

interface HistoryItem {
    reviewId: number
    workTitle: string
    workPosterPath: string
    startDate: string
}

const user = ref<MeResponse | null>(null)

const pickedDate = ref(new Date())

const year = computed(() => pickedDate.value.getFullYear())
const month = computed(() => pickedDate.value.getMonth() + 1)

const currentMonth = computed(() =>
    dayjs(pickedDate.value)
)

const daysInMonth = computed(() =>
    currentMonth.value.daysInMonth()
)

const firstDay = computed(() =>
    currentMonth.value.startOf('month').day()
)

const historyList = ref<HistoryItem[]>([])
const historyMap = ref<Record<number, HistoryItem[]>>({})

const calendarMap = computed(() => historyMap.value)

const goToWatchlist = () => {
    router.push('/watchlist')
}

const changeMonth = (step: number) => {
    pickedDate.value = dayjs(pickedDate.value)
        .add(step, 'month')
        .toDate()
}

const getHistory = async () => {
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
    } catch (error) {
        console.error('history 조회 실패', error)
    }
}



watch(
    pickedDate,
    () => {
        getHistory()
    },
    { immediate: true }
)

onMounted(async () => {
    try {
        user.value = await getMe()
    } catch (err) {
        console.error(err)
    }
})
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
                </div>
                <!-- TODO: settings 버튼은 header bell 위치로 변경
                 logout은 settings 하위 기능으로 이동 -->

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
                    <button class="nav-btn" @click="changeMonth(-1)">
                        <PhCaretLeft :size="24"></PhCaretLeft>
                    </button>

                    <div class="month-selector-wrapper">
                        <Datepicker v-model="pickedDate" inputFormat="yyyy.MM" startingView="month" minimumView="month"
                            placeholder="YYYY.MM" size="7" />
                    </div>

                    <button class="nav-btn" @click="changeMonth(1)">
                        <PhCaretRight :size="24"></PhCaretRight>
                    </button>
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
                        <span class="date">{{ n }}</span>

                        <div class="poster-box img-box" v-if="calendarMap[n]">
                            <img :src="'https://image.tmdb.org/t/p/w200' + calendarMap[n]?.[0]?.workPosterPath"
                                :alt="calendarMap[n]?.[0]?.workTitle">
                        </div>
                    </div>
                </div>
            </div>

            <!-- MEMO: 추천 시스템 완성 후, 최근 태그 통계 가능한지 확인 필요 -->
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

.profile-section .calendar-container .calendar-header {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
}

.profile-section .calendar-header .nav-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    aspect-ratio: 1 / 1;
    border-radius: 30px;
    background-color: var(--chip-default-bg);
}

.profile-section .calendar-header .month-selector-wrapper .v3dp__input_wrapper {
    font-family: var(--font-family-logo);
    font-size: 2.6rem;
}

.profile-section .v3dp__input_wrapper input {
    border: none;
    padding: 0;
    background-color: transparent;
    text-align: center;
    cursor: pointer;
}

.profile-section .v3dp__popout {
    left: 50%;
    transform: translateX(-50%);
}

.profile-section .calendar-container .weekday {
    display: flex;
    gap: 4px;
    /* TODO: 변경 시 calendar-body의 gap 같이 조정 필요 -> 추후 변수화 예정*/
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

.profile-section .calendar-body .empty-box,
.profile-section .calendar-body .date-box {
    aspect-ratio: 1 / 1;
}

.profile-section .calendar-body .date-box {
    position: relative;
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

@media screen and (min-width: 402px) {

    .profile-section .calendar-body .empty-box,
    .profile-section .calendar-body .date-box {
        aspect-ratio: 2 / 3;
    }
}
</style>
