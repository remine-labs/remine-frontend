<template>
    <div>
        로그인 처리 중...
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
    const token = route.query.token as string | undefined

    if (!token) {
        router.push('/')
        return
    }

    localStorage.setItem('accessToken', token)

    router.push('/')
})
</script>