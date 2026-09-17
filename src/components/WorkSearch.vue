<script setup lang="ts">
import { PhMagnifyingGlass, PhXCircle } from '@phosphor-icons/vue'
import { ref, watch } from 'vue'
import { api } from '../api/client'

const query = defineModel<string>({ required: true })
const currentPage = defineModel<number>('currentPage', { default: 1 })

const emit = defineEmits<{
    search: [
        data: {
            works: any[]
            totalPages: number
            totalCount: number
        }
    ]
    loading: [value: boolean]
    error: [message: string]
}>()

const isYoutubeLink = (value: string) => {
    return value.includes('youtube.com') || value.includes('youtu.be')
}

const handleSearch = async () => {
    if (!query.value.trim()) return

    emit('loading', true)
    emit('error', '')

    try {
        let res

        if (isYoutubeLink(query.value)) {
            res = await api.get('/api/youtube', {
                params: {
                    url: query.value,
                    page: currentPage.value,
                },
            })
        } else {
            res = await api.get('/api/tmdb/contents/search', {
                params: {
                    query: query.value.trim(),
                    page: currentPage.value,
                },
            })
        }

        const data = res.data.data

        const worksWithWatchlist = await Promise.all(
            data.results.map(async (work: any) => {
                const watchlistRes = await api.get(
                    `/api/watchlist/${work.mediaType}/${work.workId}`
                )

                return {
                    ...work,
                    isWatchlisted: watchlistRes.data.data.inWatchlist,
                }
            })
        )

        emit('search', {
            works: worksWithWatchlist,
            totalPages: data.total_pages,
            totalCount: data.total_results,
        })
    } catch (err) {
        emit('error', '검색 중 오류가 발생했습니다.')
        console.error(err)
    } finally {
        emit('loading', false)
    }
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

watch(currentPage, () => {
    if (query.value.trim()) {
        handleSearch()
    }
})

defineExpose({
    handleSearch,
})
</script>

<template>
    <div class="search-container input-text">
        <input v-model="query" class="work-search-input" type="search" placeholder="작품 제목 또는 유튜브 링크를 입력해주세요."
            @keyup.enter="handleSearch" />

        <button v-if="query" class="icon-btn empty-input-btn" type="button" @click="query = ''">
            <PhXCircle :size="20" weight="fill" />
        </button>

        <button class="icon-btn search-btn" type="button" @click="handleSearch">
            <PhMagnifyingGlass :size="24" />
        </button>
    </div>
</template>

<style>
.search-container {
    display: flex;
    align-items: center;
}

.work-search-input {
    flex: 1;
    min-width: 0;
}

.empty-input-btn {
    flex-shrink: 0;
    margin-left: 4px;
}

.search-btn {
    flex-shrink: 0;
    margin-left: 8px;
}
</style>