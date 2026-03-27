<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { api } from '../api/client'

const router = useRouter()

const query = ref('')
const works = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const searchWorks = async () => {
    if (!query.value.trim()) return

    loading.value = true
    error.value = ''
    try {
        const res = await api.get('/api/tmdb/movies/search', {
            params: {
                query: query.value,
            },
        })

        works.value = res.data.results
    } catch (err) {
        console.error('search failed:', err)
        error.value = '검색 실패'
    } finally {
        loading.value = false
    }
}

const selectWork = (work: any) => {
    router.push({
        path: '/review/create',
        state: {
            headerTitle: work.title,
            work: {
                id: work.id,
                title: work.title,
                overview: work.overview,
                poster_path: work.poster_path,
            },
        },
    })
}

</script>

<template>
    <section class="search-section">
        <div class="wrap">
            <div class="search-container">
                <div class="input-box">
                    <input v-model="query" type="text" @keyup.enter="searchWorks">
                </div>
                <div class="icon-box">
                    <button @click="searchWorks">
                        <PhMagnifyingGlass :size="24" />
                    </button>
                </div>
            </div>

            <p v-if="loading">loading...</p>
            <p v-if="error">{{ error }}</p>

            <div class="works-list-container">
                <div class="work-box" v-for="work in works" :key="work.id" @click='selectWork(work)'>
                    <div class="img-box poster"><img :src="`https://image.tmdb.org/t/p/w200${work.poster_path}`"
                            alt="" /></div>
                    <p class="work-name">{{ work.title }}</p>
                    <p class="release-date">{{ work.release_date }}</p>
                    <div class="story-box">
                        <p class="story">
                            {{ work.overview }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>