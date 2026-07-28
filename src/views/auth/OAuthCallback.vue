<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Loader from '../../components/Loader.vue'
import { useRouter } from 'vue-router'
import { getMe } from '../../api/auth'
import { api } from '../../api/client'
import axios from 'axios'

const router = useRouter()
const loading = ref(true)

// TODO: 약관 분기 처리

onMounted(async () => {
    try {
        await getMe()
        router.replace('/home')
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            try {
                await api.post('/api/refresh')
                await getMe()
                router.replace('/home')
            } catch {
                // router.replace('/')
                console.log("로그인 연장 실패", error)
            }
        } else {
            // router.replace('/')
            console.log("로그인 실패", error)

        }
    }
})
</script>

<template>
    <Loader v-if="loading">
        로그인 진행 중입니다.
    </Loader>
</template>