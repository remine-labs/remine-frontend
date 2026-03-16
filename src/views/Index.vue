<template>
    <section class="index-section">
        <p class="slogun-text">과거의 내가 하는 맞춤 추천,</p>
        <h1>ReMine</h1>

        <div class="login-container">
            <div v-for="provider in loginProviders" :key="provider.id" class="login-box" :class="provider.id">
                <button @click="login(provider.url)">
                    {{ provider.label }}로 로그인
                </button>
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