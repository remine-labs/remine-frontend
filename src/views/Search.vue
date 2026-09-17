<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WorkSearch from '../components/WorkSearch.vue'
import Loader from '../components/Loader.vue'
import WorkCard from '../components/WorkCard.vue'
import Pagination from '../components/Pagination.vue'
import { addWatchlist, deleteWatchlist } from '../api/watchlist.ts'

const route = useRoute()
const router = useRouter()

const query = ref('')
const works = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const currentPage = ref(1)
const totalPages = ref(0)
const totalCount = ref(0)

const handleSearch = (data: {
    works: any[]
    totalPages: number
    totalCount: number
}) => {
    works.value = data.works
    totalPages.value = data.totalPages
    totalCount.value = data.totalCount
}

const handleLoading = (value: boolean) => {
    loading.value = value

    if (value) {
        works.value = []
        totalCount.value = 0
    }
}

const handleError = (message: string) => {
    error.value = message
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const goToPlaylist = () => {
    router.push('/playlists')
}

const goToCustomWork = () => {
    router.push('/customWork')
}

const toggleWatchlistHandler = async (work: any) => {
    try {
        if (work.isWatchlisted) {
            await deleteWatchlist(work.mediaType, work.workId)
        } else {
            await addWatchlist({
                workId: work.workId,
                mediaType: work.mediaType,
                workTitle: work.workTitle,
                workPosterPath: work.workPosterPath,
                workReleaseDate: work.workReleaseDate,
            })
        }

        work.isWatchlisted = !work.isWatchlisted
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    const url = route.query.url as string

    if (url) {
        query.value = url
    }
})
</script>

<template>
    <section class="search-section">
        <div class="wrap">
            <WorkSearch v-model="query" v-model:current-page="currentPage" @search="handleSearch"
                @loading="handleLoading" @error="handleError" />
            <!-- TODO: 배너 디자인 필요, css로 진행할 것 -->
            <div class="banner-box add-playlist" @click='goToPlaylist'>
                <p>유튜브 플레이리스트 쓰세요?</p>
                <p class="description">연동하면 클릭만으로도 작품을 검색 할 수 있어요!</p>
            </div>
            <Loader v-if="loading">작품을 찾고 있어요.</Loader>
            <p v-if="error">{{ error }}</p>
            <div class="search-result" v-if="!loading && totalCount > 0">
                <div class="total-count" :class="{ invisible: totalCount === 0 }">총 {{ totalCount }}건의 결과</div>
                <div class="works-list-container">
                    <WorkCard v-for="work in works" :key="work.workId" :work-id="work.workId"
                        :work-title="work.workTitle" :work-poster-path="work.workPosterPath"
                        :work-release-date="work.workReleaseDate" :media-type="work.mediaType"
                        :is-watchlisted="work.isWatchlisted" @toggle-watchlist="toggleWatchlistHandler(work)" />
                    <div class="custom-work" @click="goToCustomWork">
                        <p>찾으시는 작품이 없나요?</p>
                        <div class="btn-box">
                            <button class="active-btn">작품 등록하기</button>
                        </div>
                    </div>
                </div>
                <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
                    @page-change="handlePageChange" />
            </div>
        </div>
    </section>
</template>

<style>
.search-section .banner-box {
    text-align: center;
    margin-top: 16px;
    background-color: var(--bg-gray);
    color: var(--text-main);
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
}

.total-count {
    text-align: right;
    font-size: var(--font-size-sub);
    line-height: 4;
}

.custom-work {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 16px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    padding: 8px;
    text-align: center;
    word-break: keep-all;
    background-color: var(--bg-surface);
    box-shadow: var(--box-default);
    height: 100%;
}
</style>