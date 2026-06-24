<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { addPlaylist, getPlaylists } from '../api/youtube';
import type { Playlist } from '../api/youtube';

const router = useRouter();
const playlistUrl = ref('');

const goToWatchlist = () => {
    router.push("/watchlist")
}

const goToPlaylistDetail = (playlist: Playlist) => {
    router.push({
        name: "playlistDetail",
        query: {
            url: playlist.playlistUrl,
        },
        state: {
            playlistName: playlist.playlistName,
            videoCount: playlist.videoCount
        }
    });
}

const playlists = ref<Playlist[]>([]);

const hanndleAddPlaylist = async () => {
    try {
        await addPlaylist(playlistUrl.value);

        window.location.reload();
    } catch (error) {
        console.error(error)
    }
}



onMounted(async () => {
    try {
        const res = await getPlaylists();

        playlists.value = res.data.data;
    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <section class="playlists-section">
        <div class="wrap">
            <div class="tab-container">
                <div class="saved-works-box" @click='goToWatchlist'>저장한 작품</div>
                <div class="youtube-playlist-box active">재생 목록</div>
            </div>
            <div class="playlists-container">
                <div class="playlist-box" v-for="item in playlists" :key='item.playlistName'>
                    <div class="img-box" @click='goToPlaylistDetail(item)'>
                        <img :src="item.thumbnailUrl" :alt="item.playlistName">
                    </div>
                    <div class="info-box">
                        <p class="playlist-name">
                            {{ item.playlistName }}
                        </p>
                        <p class="video-count">{{ item.videoCount }} 개</p>
                        <p class="move-to-total-video-list" @click='goToPlaylistDetail(item)'>전체 영상 보기</p>
                    </div>
                </div>
            </div>
            <div class="floating-menu btn-box">
                <button class='modal-open-btn'>+</button>
            </div>
        </div>
        <div class="modal-bg">
            <div class="modal-container">
                <div class="header">
                    <p class="title">재생목록 추가</p>
                    <p class="description">플레이리스트 연동을 위해서는 공개 범위가 최소 '일부 허용'이어야 합니다.</p>
                </div>
                <div class="body">
                    <input type="text" placeholder='YouTube 플레이리스트 URL을 입력하세요' v-model='playlistUrl'>
                </div>
                <div class="footer">
                    <div class="btn-box">
                        <button class='close neutral-btn'>CLOSE</button>
                        <button class='add-playlist-btn active-btn' @click='hanndleAddPlaylist'>ADD</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style></style>