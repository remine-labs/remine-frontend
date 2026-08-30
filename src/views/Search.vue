<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhMagnifyingGlass, PhXCircle } from '@phosphor-icons/vue'
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

const goToCustomWork = () => {
    router.push('/customWork')
}

const handleEmptyInput = () => {
    query.value = "";
}

// TODO: workDetail 페이지에서 다시 돌아오더라도 기존 검색 값 유지하여, tmdb api 사용 횟수 줄이기

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
                    <!-- TODO: mobile에서 입력값 삭제 버튼 있는지 확인 후, 없을 경우
                     type을 text로 변경하고 x 버튼 추가하여 clear 기능 추가 -->
                    <input class="work-search-input" v-model="query" type="search" @keyup.enter="handleSearch"
                        placeholder='작품 제목 또는 유튜브 링크를 입력해주세요.' autofocus>
                </div>
                <div class="icon-box empty-input-btn" :class="{ active: query }">
                    <button class="icon-btn" @click="handleEmptyInput">
                        <PhXCircle :size="20" weight="fill" />
                    </button>
                </div>
                <div class="icon-box search-btn">
                    <button class="icon-btn" @click="handleSearch">
                        <PhMagnifyingGlass :size="24" />
                    </button>
                </div>
                <!-- TODO: 배너 디자인 필요, css로 진행할 것 -->
                <div class="banner-box add-playlist" @click='goToPlaylist'>
                    <p>유튜브 플레이리스트 쓰세요?</p>
                    <p class="description">연동하면 클릭만으로도 작품을 검색 할 수 있어요!</p>
                </div>
            </div>

            <p v-if="loading">loading...</p>
            <p v-if="error">{{ error }}</p>
            <div class="search-result" v-if="totalCount > 0">
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
            </div>
            <!-- TODO: 검색 이후에 노출 -->

            <!-- TODO: pagination 위치 -->
        </div>
    </section>
</template>

<style>
.search-section .input-box .work-search-input {
    width: 100%;
    box-sizing: border-box;
    padding-right: 60px;
}

.search-section .search-container .empty-input-btn {
    position: absolute;
    right: 45px;
    top: 10px;
    z-index: 10;
    color: var(--text-sub);
    visibility: hidden;
    opacity: 0;
    transition: 0.3s ease-in-out;
}

.search-section .search-container .empty-input-btn.active {
    visibility: visible;
    opacity: 1;
}

.search-section .search-container .search-btn {
    position: absolute;
    right: 3px;
    top: 3px;
    width: 32px;
    aspect-ratio: 1 / 1;
    z-index: 99;
    color: var(--text-sub);
}

.search-section .banner-box {
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

.search-section .custom-work {
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
}
</style>