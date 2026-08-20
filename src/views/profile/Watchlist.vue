<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import WorkCard from '../../components/WorkCard.vue';
import { getWatchlist, deleteWatchlist, addWatchlist } from '../../api/watchlist.ts';
import type { Watchlist } from '../../api/watchlist.ts';

const router = useRouter();
const watchlist = ref<Watchlist[]>([]);
const isMovieChecked = ref(true);
const isTvChecked = ref(true);

const goToPlaylists = () => {
    router.push("/playlists")
}

const fetchWatchlist = async () => {
    try {
        let params = {};
        if (isMovieChecked.value && !isTvChecked.value) {
            params = { mediaType: 'movie' };
        } else if (!isMovieChecked.value && isTvChecked.value) {
            params = { mediaType: 'tv' };
        }

        const res = await getWatchlist(params);
        watchlist.value = res.data.data.content.map((work: Watchlist) => ({
            ...work,
            isWatchlisted: true
        }));
    } catch (error) {
        console.error(error);
    }
};

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
        // 목록 갱신 필요 시 fetchWatchlist() 호출
    } catch (error) {
        console.error(error);
    }
};

watch([isMovieChecked, isTvChecked], () => {
    fetchWatchlist();
});

onMounted(fetchWatchlist);

</script>

<template>
    <section class="watchlist-section">
        <div class="wrap">
            <div class="tab-container">
                <div class="saved-works-box active">저장한 작품</div>
                <div class="youtube-playlist-box" @click='goToPlaylists'><button>재생 목록</button></div>
            </div>
            <div class="filter-box">
                <!-- TODO: filter 디자인 -->
                <div class="checkbox">
                    <input type="checkbox" id='checkbox-movie' v-model='isMovieChecked'>
                    <label for="checkbox-movie">영화</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id='checkbox-tv' v-model='isTvChecked'>
                    <label for="checkbox-tv">TV</label>
                </div>
            </div>
            <div class="works-list-container">
                <WorkCard v-for="work in watchlist" :key="work.workId" :work-id="work.workId"
                    :work-title="work.workTitle" :work-poster-path="work.workPosterPath" :media-type="work.mediaType"
                    :work-release-date='work.workReleaseDate' :is-watchlisted="work.isWatchlisted"
                    @toggle-watchlist="toggleWatchlistHandler(work)" />
            </div>
        </div>
    </section>
</template>

<style>
.tab-container {
    display: flex;
    gap: 8px;
    padding-bottom: 10px;
}

.tab-container div {
    width: calc(50% - 4px);
    text-align: center;
    padding: 10px 0;
    background-color: var(--bg-surface);
    border-radius: 6px 6px 0 0;
    cursor: pointer;
}

.tab-container div.active {
    background: var(--btn-active-bg);
    color: var(--text-inverse);
}

.watchlist-section .filter-box {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}
</style>