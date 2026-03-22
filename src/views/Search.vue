<script setup lang="ts">
import { ref } from 'vue'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { api } from '../api/client'

const query = ref('')
const works = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const searchWorks = async () => {
    if (!query.value.trim()) return

    loading.value = true
    error.value = ''
    // TODO: search API 500 이슈로 추후 재확인 예정
    try {
        const res = await api.get('/api/tmdb/movies/search', {
            params: {
                query: query.value,
            },
        })

        console.log('search response:', res.data)
        works.value = res.data
    } catch (err) {
        console.error('search failed:', err)
        error.value = '검색 실패'
    } finally {
        loading.value = false
    }
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

            <div v-for="work in works" :key="work.id" class="works-list-container">
                <div class="work-box">
                    <div class="img-box poster">{{ work.posterPath }}</div>
                    <p class="work-name">{{ work.title }}</p>
                    <p class="release-date">{{ work.releaseDate }}</p>
                    <p class="genre">{{ work.genre }}</p>

                    <div class="actor-box">
                        <p v-for="actor in work.actors" :key="actor" class="actor">
                            {{ actor }}
                        </p>
                    </div>

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