<script setup lang="ts">

const login = (url: string) => {
    window.location.href = url
}

const loginProviders = [
    {
        id: 'google',
        label: 'Google',
        url: `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`
    },
    {
        id: 'kakao',
        label: 'Kakao',
        url: `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`
    }
]

</script>

<template>
    <section class="index-section">
        <div class="wrap">
            <!-- TODO: 스플래시 화면 구성 -->
            <div class="title-container">
                <h1 class='logo'>ReMine</h1>
                <p class="slogun-text">당신의 기록으로,</p>
                <p class="slogun-text">OTT를 뛰어넘어</p>
                <p class="slogun-text">당신만을 위한</p>
                <p class="slogun-text">맞춤 추천 서비스</p>
            </div>
            <div class="login-container">
                <div class="btn-box" :class="provider.id" v-for="provider in loginProviders" :key="provider.id">
                    <button class="oauth-btn" @click="login(provider.url)">
                        {{ provider.label }}로 로그인
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>


<style>
/* google design guide */
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;1,500&display=swap');

.index-section .title-container {
    text-align: center;
}

.index-section .title-container .slogun-text {
    font-size: var(--font-size-title);
    font-weight: 500;
}

.index-section .title-container .logo {
    margin: 2rem 0;
}

.index-section .login-container {
    width: 300px;
    margin: 5rem auto 0;
}

.index-section .login-container .btn-box {
    width: 100%;
    margin-bottom: 1rem;
    text-align: center;
    border: #747775 solid 1px;
    border-radius: 8px;
}


.index-section .login-container .btn-box button {
    width: 100%;
}

.index-section .btn-box.google {
    background-color: #ffff;
    color: rgba(0, 0, 0, .54);
}

.index-section .btn-box.kakao {
    background-color: #fee500;
    color: rgba(0, 0, 0, .85);
}

@media (prefers-color-scheme: dark) {
    .index-section .login-container .btn-box.google {
        background-color: #222;
        border: #747775 solid 1px;
    }
}
</style>