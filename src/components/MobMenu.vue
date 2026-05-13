<script setup lang='ts'>
import { PhHouseLine, PhBook, PhSparkle, PhUser, PhMagnifyingGlass } from "@phosphor-icons/vue";
import { useRouter } from "vue-router";

const router = useRouter()

const goToHome = () => {
    router.push('/home')
}

const goToTimeline = () => {
    router.push('/timeline')
}

const goToSearch = () => {
    router.push('/search')
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
    max-width: 47.5rem;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 999;
    overflow: hidden;
    padding-top: 34px;
}

.nav-section {
    height: 84px;
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
    justify-content: space-between;
    gap: 30px;
    height: inherit;
    padding: 10px 20px 20px;
}

nav .wrap .icon-container .icon-box {
    min-width: calc((100% - 120px)/5);
}

nav .wrap .icon-container .icon-box button {
    flex-direction: column;
}

nav .wrap .icon-container>.icon-box button svg {
    color: var(--text-icon)
}

nav .wrap .icon-container span {
    font-size: var(--font-size-sub);
    line-height: 2;
    color: var(--text-menu);
}

nav .wrap .icon-container>div {
    flex: 1;
}

nav .wrap .icon-container .fab-box .icon-box {
    position: absolute;
    top: -70px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 66px;
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