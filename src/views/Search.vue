<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import WorkCard from '../components/WorkCard.vue'
import { api } from '../api/client'
import { addWatchlist, deleteWatchlist, getWatchlist } from '../api/watchlist.ts'

const route = useRoute();
const router = useRouter()

const query = ref('')
const works = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const isYoutubeLink = (value: string) => {
    return value.includes('youtube.com') || value.includes('youtu.be')
}

const goToPlaylist = () => {
    router.push('/playlists')
}

const handleSearch = async () => {
    if (!query.value.trim()) return

    loading.value = true
    error.value = ''

    try {
        let res

        if (isYoutubeLink(query.value)) {
            res = await api.get('/api/youtube', {
                params: {
                    url: query.value,
                },
            })
        } else {
            res = await api.get('/api/tmdb/contents/search', {
                params: {
                    query: query.value.trim(),
                },
            })
        }
        const watchlistRes = await getWatchlist();
        const watchlist = watchlistRes.data.data.content;

        const watchlistSet = new Set(
            watchlist.map((item: any) => item.workId)
        );

        works.value = res.data.data.results.map((work: any) => ({
            ...work,
            isWatchlisted: watchlistSet.has(work.workId)
        }));
        totalCount.value = res.data.data.total_results
    } catch (err) {
        error.value = '검색 중 오류가 발생했습니다.'
        console.error(err)
    } finally {
        loading.value = false
    }
}

const totalCount = ref(0)

const toggleWatchlistHandler = async (work: any) => {
    try {
        if (work.isWatchlisted) {
            await deleteWatchlist(work.mediaType, work.workId);
        } else {
            await addWatchlist({
                workId: work.workId,
                mediaType: work.mediaType,
                workTitle: work.workTitle,
                workPosterPath: work.workPosterPath,
                workReleaseDate: work.workReleaseDate,
            });
        }

        work.isWatchlisted = !work.isWatchlisted;
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    const url = route.query.url as string;

    if (url) {
        query.value = url;
        handleSearch();
    }
})
</script>

<template>
    <section class="search-section">
        <div class="wrap">
            <div class="search-container relative">
                <div class="input-box">
                    <input class="work-search-input" v-model="query" type="search" @keyup.enter="handleSearch"
                        placeholder='작품 제목 또는 유튜브 링크를 입력해주세요.' autofocus>
                </div>
                <div class="icon-box">
                    <button class="icon-btn" @click="handleSearch">
                        <PhMagnifyingGlass :size="24" />
                    </button>
                </div>
                <div class="banner-box description" @click='goToPlaylist'>
                    <p>플레이리스트에 저장하셨다면,</p>
                    <p>한 번 연동으로 검색부터 관심작품까지 한 번에!</p>
                </div>
            </div>

            <p v-if="loading">loading...</p>
            <p v-if="error">{{ error }}</p>
            <div class="total-count" :class="{ invisible: totalCount === 0 }">총 {{ totalCount }}건의 결과</div>
            <div class="works-list-container">
                <WorkCard v-for="work in works" :key="work.workId" :work-id="work.workId" :work-title="work.workTitle"
                    :work-poster-path="work.workPosterPath" :work-release-date="work.workReleaseDate"
                    :media-type="work.mediaType" :is-watchlisted="work.isWatchlisted"
                    @toggle-watchlist="toggleWatchlistHandler(work)" />
            </div>
        </div>
    </section>
</template>

<style>
.search-section .input-box .work-search-input {
    width: 100%;
    box-sizing: border-box;
}

.search-section .search-container .icon-box {
    position: absolute;
    right: 3px;
    top: 3px;
    width: 32px;
    aspect-ratio: 1 / 1;
    z-index: 99;
    color: var(--text-sub);
}

.search-section .search-container .banner-box {
    text-align: center;
    margin-top: 16px;
    background-color: var(--bg-gray);
    color: var(--text-main);
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
}

.search-section .total-count {
    text-align: right;
    font-size: var(--font-size-sub);
    line-height: 4;
}
</style>