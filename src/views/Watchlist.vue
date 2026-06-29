<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import WorkCard from '../components/WorkCard.vue';
import { getWatchlist, deleteWatchlist } from '../api/watchlist.ts';
import type { Watchlist } from '../api/watchlist.ts';

const router = useRouter();
const watchlist = ref<Watchlist[]>([]);

const goToPlaylists = () => {
    router.push("/playlists")
}

const deleteWatchlistHandler = async (work: Watchlist) => {
    try {
        await deleteWatchlist(work.mediaType, work.workId);

        const res = await getWatchlist();
        watchlist.value = res.data.data.content;
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    try {
        const res = await getWatchlist();
        watchlist.value = res.data.data.content;
    } catch (error) {
        console.error(error)
    }
})

</script>

<template>
    <section class="watchlist-section">
        <div class="wrap">
            <div class="tab-container">
                <div class="saved-works-box active">저장한 작품</div>
                <div class="youtube-playlist-box" @click='goToPlaylists'><button>재생 목록</button></div>
            </div>
            <div class="filter-box">
                <div class="checkbox">
                    <input type="checkbox" id='checkbox-movie'>
                    <label for="checkbox-movie">영화</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id='checkbox-tv'>
                    <label for="checkbox-tv">TV</label>
                </div>
            </div>
            <div class="works-list-container">
                <WorkCard v-for="work in watchlist" :key="work.workId" :work-id="work.workId"
                    :work-title="work.workTitle" :work-poster-path="work.workPosterPath" :media-type="work.mediaType"
                    :work-release-date='work.workReleaseDate' @toggle-watchlist="deleteWatchlistHandler(work)" />
                <!-- TODO: :work-release-date는 추후 api 수정 후에 기입 -->
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
</style>