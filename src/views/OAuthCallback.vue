<script setup lang="ts">
import { ref } from 'vue'
import Loader from '../components/Loader.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMe } from '../api/auth'

const router = useRouter()
const loading = ref(true)

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

<template>
    <Loader v-if="loading">
        로그인 진행 중입니다.
    </Loader>
</template>