<template>
    <div>로그인 처리 중</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMe } from '../api/auth'

const router = useRouter()

onMounted(async () => {
    try {
        const user = await getMe()

        console.log('로그인 사용자:', user)

        router.replace('/home')
    } catch (error) {
        console.error('로그인 확인 실패:', error)
        // router.replace('/')
    }
})
</script>