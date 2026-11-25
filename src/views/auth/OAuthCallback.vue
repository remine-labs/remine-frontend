<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Loader from '../../components/Loader.vue'
import { useRouter } from 'vue-router'
import { getMe, isBirthDateRequiredError } from '../../api/auth'
import { api } from '../../api/client'
import { getMyTerms } from '../../api/terms'
import { useToast } from '../../composables/useToast'
import axios from 'axios'

const router = useRouter()
const loading = ref(true)
const { showToast } = useToast()

const redirectAfterLogin = async () => {
    const terms = await getMyTerms()
    const hasRequiredTermsToAgree = terms.some(
        (term) => term.required && !term.agreed
    )

    router.replace(hasRequiredTermsToAgree ? '/terms' : '/')
}

const handleLoginFailure = async (error: unknown) => {
    if (isBirthDateRequiredError(error)) {
        loading.value = false
        await router.replace('/birth-date')
        return
    }

    console.error("로그인 실패", error)
    loading.value = false
    showToast("로그인에 실패했습니다. 다시 시도해 주세요.", "error")
    await router.replace('/login')
}

onMounted(async () => {
    try {
        await getMe()
        await redirectAfterLogin()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            try {
                await api.post('/api/refresh')
                await getMe()
                await redirectAfterLogin()
                return
            } catch (refreshError) {
                await handleLoginFailure(refreshError)
            }
        } else {
            await handleLoginFailure(error)
        }
    }
})
</script>

<template>
    <Loader v-if="loading">
        로그인 진행 중입니다.
    </Loader>
</template>