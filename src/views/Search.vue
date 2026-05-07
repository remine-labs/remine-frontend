<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhHeart, PhMagnifyingGlass } from '@phosphor-icons/vue'
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
        const res = await api.get('/api/tmdb/contents/search', {
            params: {
                query: query.value,
            },
        })

        works.value = res.data.data.results
        totalCount.value = res.data.data.total_results ?? 0
    } catch (err) {
        console.error('search failed:', err)
        error.value = '검색 실패'
    } finally {
        loading.value = false
    }
}

const totalCount = ref(0)


const goToWorkDetail = (work: any) => {
    router.push(`/work/${work.mediaType}/${work.workId}`)
}

</script>

<template>
    <section class="search-section">
        <div class="wrap">
            <div class="search-container relative">
                <div class="input-box">
                    <input class="work-search-input" v-model="query" type="search" @keyup.enter="searchWorks"
                        placeholder='작품 제목을 입력해주세요.' autofocus>
                </div>
                <div class="icon-box">
                    <button class="icon-btn" @click="searchWorks">
                        <PhMagnifyingGlass :size="24" />
                    </button>
                </div>
            </div>

            <p v-if="loading">loading...</p>
            <p v-if="error">{{ error }}</p>
            <div class="total-count" :class="{ invisible: totalCount === 0 }">총 {{ totalCount }}건의 결과</div>
            <div class="works-list-container">

                <div class="work-box relative" v-for="work in works" :key="work.workId" @click="goToWorkDetail(work)">
                    <div class="type-box">
                        <span class="media-type sub-text chip-important" :class="work.mediaType">{{
                            work.mediaType.toUpperCase()
                        }}</span>
                    </div>
                    <div class="img-box poster">
                        <img :src="`https://image.tmdb.org/t/p/w200${work.workPosterPath}`" :alt="work.workTitle" />
                    </div>

                    <div class="work-info-box">
                        <div class="work-title-box">
                            <span class="work-name ellipsis-1">
                                {{ work.workTitle }}
                            </span>
                            <span class="release-year number">
                                ({{ work.workReleaseDate?.slice(0, 4) }})
                            </span>
                        </div>
                        <div class="icon-box watchlist">
                            <button class='heart'>
                                <PhHeart :size='20'></PhHeart>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.search-section .input-box .work-search-input {
    width: 100%;
    line-height: 4rem;
    text-indent: var(--font-size-body);
    padding-right: 40px;
    box-sizing: border-box;
}

.search-section .search-container .icon-box {
    position: absolute;
    right: 3px;
    top: 3px;
    width: 40px;
    height: 40px;
    z-index: 99;
}

.search-section .total-count {
    text-align: right;
    font-size: var(--font-size-sub);
    line-height: 4;
}

.search-section .works-list-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 8px;
}

.search-section .works-list-container .work-box {
    width: calc(50% - 4px);
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--bg-elevated);
    cursor: pointer;
    box-shadow: 0px 0px 8px #00000014
}

.search-section .work-box .type-box {
    position: absolute;
    top: 3px;
    left: 5px;
}

.search-section .work-box .img-box {
    aspect-ratio: 2/3;
}

.search-section .work-box .img-box img {
    height: 100%;
    object-fit: cover;
}

.search-section .work-box .work-info-box {
    display: flex;
    gap: 3px;
    align-items: center;
    padding: 12px 6px;
}

.search-section .work-box .work-title-box {
    display: flex;
    align-items: center;
    width: calc(100% - 27px);
    gap: 4px;
}

.search-section .work-box .work-title-box .work-name {
    max-width: calc(100% - 4rem);
}

.search-section .work-box .work-title-box .release-year {
    flex-shrink: 0;
}
</style>