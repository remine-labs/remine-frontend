<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { addPlaylist, getPlaylists } from '../api/youtube';
import type { Playlist } from '../api/youtube';
import { PhListPlus } from '@phosphor-icons/vue';

const router = useRouter();
const playlistUrl = ref('');
const isAddPlaylistModalOpen = ref(false);

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
                <div class="playlist-box relative" v-for="item in playlists" :key='item.playlistName'>
                    <div class="img-box" @click='goToPlaylistDetail(item)'>
                        <img :src="item.thumbnailUrl" :alt="item.playlistName">
                    </div>
                    <div class="info-box">
                        <p class="playlist-name title">
                            {{ item.playlistName }}
                        </p>
                        <p class="video-count">{{ item.videoCount }}개</p>
                        <button class="move-to-total-video-list" @click='goToPlaylistDetail(item)'>전체 영상 보기</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="floating-box">
            <div class="icon-box add-playlist">
                <button @click="isAddPlaylistModalOpen = true">
                    <PhListPlus :size='24' />
                </button>
            </div>
        </div>
        <div class="modal-bg add-playlist-modal" :class="{ hidden: !isAddPlaylistModalOpen }">
            <div class="modal-container">
                <div class="header">
                    <p class="title">재생목록 추가</p>
                </div>
                <div class="body">
                    <p class="description">플레이리스트 연동을 위해서는 공개 범위가 최소 <strong>'일부 허용'</strong>이어야 합니다.</p>
                    <input type="text" placeholder='YouTube 플레이리스트 URL을 입력하세요' v-model='playlistUrl'>
                </div>
                <div class="footer">
                    <div class="btn-box">
                        <button class='close neutral-btn' @click="isAddPlaylistModalOpen = false">취소</button>
                        <button class='add-playlist-btn active-btn' @click='hanndleAddPlaylist'>추가</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.playlists-section .playlists-container {
    margin-top: 16px;
}

.playlists-section .playlist-box {
    display: flex;
    gap: 8px;
}

.playlists-section .playlist-box .img-box {
    width: calc(50% - 4px);
    border-radius: 8px;
    overflow: hidden;
}

.playlists-section .move-to-total-video-list {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: inherit;
}

.playlists-section .floating-box .add-playlist {
    background-color: var(--bg-surface);
}
</style>
