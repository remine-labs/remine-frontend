<script setup lang='ts'>
import { useRouter } from 'vue-router';
// TODO: watchlist 관련 api 생성 이후
// import WorkCard from '../components/WorkCard.vue';

const router = useRouter()

const goToPlaylists = () => {
    router.push("/playlists")
}

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
            <!-- <div class="works-list-container">
            <WorkCard v-for='work in works' :key='work.workId' :work-id='work.workId' :work-title='work.workTitle'
                :work-poster-path='work.workPosterPath' :work-release-date='work.workReleaseDate'
                :media-type='work.mediaType' />
            </div> -->
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