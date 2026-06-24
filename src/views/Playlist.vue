<script setup lang='ts'>
import { useRouter } from 'vue-router';
import { deletePlaylist, getPlaylistDetail } from '../api/youtube';
import type { PlaylistDetail } from '../api/youtube';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const playlistUrl = route.query.url as string;
const playlistName = history.state.playlistName;
const videoCount = history.state.videoCount;

const goToWatchlist = () => {
    router.push('/watchlist')
}

const goToPlaylists = () => {
    router.push('/playlists')
}

const goToSearch = (videoUrl: string) => {
    router.push({
        name: "search",
        query: {
            url: videoUrl
        }
    })
}

const playlistDetail = ref<PlaylistDetail[]>([]);

const handleDeletePlaylist = async () => {
    try {
        await deletePlaylist(playlistUrl)

        alert('플레이리스트 연동이 해제되었습니다. 재생목록 리스트로 이동합니다.')
        router.push({
            name: 'playlists'
        })
    } catch (error) {
        console.error(error)
    }
}

onMounted(async () => {
    try {
        const res = await getPlaylistDetail(playlistUrl);
        playlistDetail.value = res.data.data;
    } catch (error) {
        console.error(error)
    }
})

</script>

<template>
    <section class="playlist-section">
        <div class="wrap">
            <div class="tab-container">
                <div class="saved-works-box" @click='goToWatchlist'>저장한 작품</div>
                <div class="youtube-playlist-box active" @click='goToPlaylists'>재생 목록</div>
            </div>
            <p class='playlist-info'>{{ playlistName }} · {{ videoCount }} 개</p>
            <button class="open-delete-modal-btn">삭제하기</button>
            <p class="desciption">영상을 선택하면, 작품 정보를 알려드립니다.</p>
            <div class="playlist-item-container">
                <div class="item-box" v-for='item in playlistDetail' :key='item.videoName'
                    @click='goToSearch(item.videoUrl)'>
                    <div class="img-box">
                        <img :src="item.thumbnailUrl" :alt="item.videoName">
                    </div>
                    <p class="video-name ellipsis-2">
                        {{ item.videoName }}
                    </p>
                </div>
            </div>
        </div>
        <div class="modal-bg">
            <div class="modal-body">
                <div class="header">
                    <p>해당 플레이리스트 연동을 해제하시겠습니까?</p>
                </div>
                <div class="body btn-box">
                    <button class="neutral-btn">취소</button>
                    <button class="active-btn" @click='handleDeletePlaylist'>확인</button>
                </div>
                <div class="footer">
                    <p>플레이리스트 재연동을 원할 경우, 재생 목록 화면에서 추가해주세요.</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.playlist-section .playlist-item-container {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 10px;
}

.playlist-section .playlist-info {
    font-weight: 500;
    text-align: right;
    margin-top: 20px;
}

.playlist-section .item-box .img-box {
    aspect-ratio: 1/1;
    overflow: hidden;
    border-radius: 4px;
}

.playlist-section .item-box img {
    object-fit: cover;
    height: 100%;
}

.playlist-section .item-box .video-name {
    margin-top: 10px;
    line-height: 1.4;
}
</style>