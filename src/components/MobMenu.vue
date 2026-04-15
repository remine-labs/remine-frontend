<script setup lang='ts'>
import { PhHouseLine, PhBook, PhPenNib, PhSparkle, PhUser } from "@phosphor-icons/vue";
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
                    <div class="left-box">
                        <div class="icon-box home">
                            <button @click='goToHome'>
                                <PhHouseLine :size='24'></PhHouseLine>
                            </button>
                        </div>
                        <div class="icon-box timeline">
                            <button @click='goToTimeline'>
                                <PhBook :size='24'></PhBook>
                            </button>
                        </div>
                    </div>
                    <div class="fab-box" @click='goToSearch'>
                        <div class="icon-box create">
                            <button>
                                <PhPenNib :size='24'></PhPenNib>
                            </button>
                        </div>
                    </div>
                    <div class="right-box">
                        <div class="icon-box recommend">
                            <button>
                                <PhSparkle :size='24'></PhSparkle>
                            </button>
                        </div>
<<<<<<< HEAD
                        <div class="icon-box profile">
=======
                        <div class="icon-box profile" @click='goToProfile'>
>>>>>>> a717be5 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
                            <button>
                                <PhUser :size='24'></PhUser>
                            </button>
                        </div>
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
    padding-top: 62px;
}

.nav-section {
    height: 7.2rem;
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
    gap: 16px;
    height: inherit;
    padding-bottom: 10px;
}

nav .wrap .fab-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    background-color: var(--btn-active-bg);
    color: var(--text-inverse);
    border-radius: 64px;
    margin-top: -56px;
    box-shadow: 0px 0px 6px #00000073;
}

nav .wrap .fab-box button {
    transform: rotate(90deg);
}

nav .wrap .icon-container .left-box,
nav .wrap .icon-container .right-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 64px - 32px);
    height: 100%;
}

nav .wrap .icon-container .left-box .icon-box,
nav .wrap .icon-container .right-box .icon-box {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
