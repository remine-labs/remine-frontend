<template>
    <section class="index-section">
        <div class="wrap">
            <div class="title-container">
                <h1 class='logo'>ReMine</h1>
                <p class="slogun-text">당신의 기록으로,</p>
                <p class="slogun-text">OTT를 뛰어넘어</p>
                <p class="slogun-text">당신만을 위한</p>
                <p class="slogun-text">맞춤 추천 서비스</p>
            </div>

            <div class="login-container">
                <div v-for="provider in loginProviders" :key="provider.id" class="login-box" :class="provider.id">
                    <button class='google-oauth' @click="login(provider.url)">
                        {{ provider.label }}로 로그인
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

const login = (url: string) => {
    window.location.href = url
}

const loginProviders = [
    {
        id: 'google',
        label: 'Google',
        url: `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`
    }
]

</script>

<style>
/* google design guide */
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;1,500&display=swap');

.title-container {
    text-align: center;
}

.title-container .slogun-text {
    font-size: 2rem;
    font-weight: 500;
}

.title-container .logo {
    margin: 2rem 0;
}

.login-container {
    width: 300px;
    margin: 5rem auto 0;
}

.login-container button {
    width: 100%;
}

.login-container .google-oauth {
    background-color: #ffff;
    border: #747775 solid 1px;
}

@media (prefers-color-scheme: dark) {
    .login-container .google-oauth {
        background-color: #222;
        border: #747775 solid 1px;
    }
}
</style>