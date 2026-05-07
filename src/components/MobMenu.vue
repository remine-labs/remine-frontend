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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d76a651 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> d9d7398 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> d6033a7 (:spakrles: design-system feat: header/nav fixed 고정 적용)
=======
>>>>>>> a045fa0 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> c04db05 (:spakrles: design-system feat: header/nav fixed 고정 적용)
=======
>>>>>>> 1a9e398 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> e34e984 (:spakrles: design-system feat: header/nav fixed 고정 적용)
=======
>>>>>>> 08ae8d9 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> fd1131d (:spakrles: design-system feat: header/nav fixed 고정 적용)
                    <div class="right-box">
                        <div class="icon-box recommend">
=======
                    <div class="fab-box relative">
                        <div class="icon-box discover">
>>>>>>> a1662a2 (:art: design-system sytle: redesign mobile header and menu)
                            <button>
                                <PhSparkle :size='24'></PhSparkle>
                            </button>
                        </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                        <div class="icon-box profile">
=======
                        <div class="icon-box profile" @click='goToProfile'>
>>>>>>> a717be5 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
                        <div class="icon-box profile" @click='goToProfile'>
>>>>>>> d76a651 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
                        <div class="icon-box profile" @click='goToProfile'>
>>>>>>> 00e64a6 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
                            <button>
                                <PhUser :size='24'></PhUser>
                            </button>
                        </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d9d7398 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> a045fa0 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> 1a9e398 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> 08ae8d9 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
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
=======
                    </div>
                    <div class="icon-box timeline" @click='goToTimeline'>
                        <button>
                            <PhBook :size='24'></PhBook>
                            <span>REVIEWS</span>
>>>>>>> a1662a2 (:art: design-system sytle: redesign mobile header and menu)
                        </button>
                    </div>
                    <div class="icon-box profile" @click='goToProfile'>
                        <button>
                            <PhUser :size='24'></PhUser>
<<<<<<< HEAD
                        </button>
>>>>>>> 663ccce (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d76a651 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> d9d7398 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> d6033a7 (:spakrles: design-system feat: header/nav fixed 고정 적용)
=======
>>>>>>> a045fa0 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> c04db05 (:spakrles: design-system feat: header/nav fixed 고정 적용)
=======
>>>>>>> 1a9e398 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> e34e984 (:spakrles: design-system feat: header/nav fixed 고정 적용)
=======
>>>>>>> 08ae8d9 (:sparkles: profile feat: profile 페이지에 calendar api 연결 (캘린더 디자인X))
=======
>>>>>>> fd1131d (:spakrles: design-system feat: header/nav fixed 고정 적용)
=======
                            <span>PROFILE</span>
                        </button>
>>>>>>> a1662a2 (:art: design-system sytle: redesign mobile header and menu)
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

nav .wrap .icon-container .icon-box button {
    flex-direction: column;
}

nav .wrap .icon-container>.icon-box button svg {
    color: var(--text-icon)
}

nav .wrap .icon-container span {
    font-size: 12px;
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