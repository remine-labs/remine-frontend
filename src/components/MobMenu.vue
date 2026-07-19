<script setup lang='ts'>
import { PhHouseLine, PhBook, PhSparkle, PhUser, PhMagnifyingGlass } from "@phosphor-icons/vue";
import { useRouter } from "vue-router";

const router = useRouter()

const goToHome = () => {
    router.push('/home')
}

const goToSearch = () => {
    router.push('/search')
}


const goToTimeline = () => {
    router.push('/timeline')
}

const goToProfile = () => {
    router.push('/profile')
}
</script>

<template>
    <nav>
        <div class="nav-section">
            <div class="wrap">
                <div class="icon-container">
                    <div class="icon-box home" @click='goToHome'>
                        <button>
                            <PhHouseLine :size='24'></PhHouseLine>
                            <span>HOME</span>
                        </button>
                    </div>
                    <div class="icon-box search" @click='goToSearch'>
                        <button>
                            <PhMagnifyingGlass :size='24'></PhMagnifyingGlass>
                            <span>SEARCH</span>
                        </button>
                    </div>
                    <div class="fab-box relative">
                        <div class="icon-box discover">
                            <button>
                                <PhSparkle :size='24'></PhSparkle>
                            </button>
                        </div>
                    </div>
                    <div class="icon-box timeline" @click='goToTimeline'>
                        <button>
                            <PhBook :size='24'></PhBook>
                            <span>REVIEWS</span>
                        </button>
                    </div>
                    <div class="icon-box profile" @click='goToProfile'>
                        <button>
                            <PhUser :size='24'></PhUser>
                            <span>PROFILE</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style>
nav {
    position: fixed;
    width: 100%;
    max-width: var(--frame-width);
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 999;
    overflow: hidden;
    padding-top: 34px;
}

.nav-section {
    height: var(--menu-height);
    color: var(--btn-active-bg)
}

nav .wrap {
    height: inherit;
    background: var(--bg-elevated);
    border-radius: 16px 16px 0 0;
    box-shadow: 0px 2px 6px #0000001e;
}

nav .wrap .icon-container {
    display: flex;
    align-items: center;
    gap: 10px;
    height: inherit;
    padding: 10px 20px;
}

nav .wrap .icon-container .icon-box button {
    flex-direction: column;
}

nav .wrap .icon-container>.icon-box button svg {
    color: var(--text-icon)
}

nav .wrap .icon-container span {
    /* MEMO: 메뉴 하단의 텍스트는 디자인의 보조적인 역할로, 아이콘이 메인 버튼
    디바이스별 디자인 통일을 위해 font-size를 rem대신 px로 고정 */
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-menu);
}

nav .wrap .icon-container>div {
    flex: 1;
}

nav .wrap .icon-container .fab-box .icon-box {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 60px;
    aspect-ratio: 1/1;
    overflow: hidden;
    background-color: var(--btn-active-bg);
    border-radius: 50%;
    box-shadow: 0px 0px 4px #1f305928;
    z-index: 99;
}

nav .wrap .fab-box .icon-box button {
    color: var(--text-inverse);
}
</style>