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


const selectWork = (work: any) => {
    router.push({
        path: '/review/create',
        state: {
            headerTitle: work.title,
            work: {
                id: work.workId,
                title: work.workTitle,
                release_date: work.workReleaseDate,
                overview: work.workOverview,
                poster_path: work.workPosterPath,
            },
        },
    })
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

                <div class="work-box relative" v-for="work in works" :key="work.workId" @click="selectWork(work)">
                    <div class="img-box poster">
                        <img :src="`https://image.tmdb.org/t/p/w200${work.workPosterPath}`" :alt="work.workTitle" />
                    </div>

                    <div class="work-info-box">
                        <div class="work-title-box">
                            <span class="media-type sub-text" :class="work.mediaType">{{ work.mediaType.toUpperCase()
                            }}</span>

                            <div class="work-title">
                                <span class="work-name title ellipsis-1">
                                    {{ work.workTitle }}
                                </span>

                                <span class="release-year number">
                                    ({{ work.workReleaseDate?.slice(0, 4) }})
                                </span>
                            </div>
                        </div>

                        <div class="story-box" :class="{ empty: !work.workOverview?.trim() }">
                            <p class="story long-text ellipsis-4">
                                {{ work.workOverview?.trim() ? work.workOverview : '제공된 정보가 없습니다.' }}
                            </p>
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
<<<<<<< HEAD
<<<<<<< HEAD
    box-sizing: border-box;
=======
>>>>>>> 8d610c7 (:art: search-work style: search input 퍼블리싱)
=======
    box-sizing: border-box;
>>>>>>> e0044a2 (:art: search-work style: 검색 결과 카드 레이아웃 및 UI 퍼블리싱)
}

.search-section .search-container .icon-box {
    position: absolute;
    right: 3px;
    top: 3px;
    width: 40px;
    height: 40px;
    z-index: 99;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e0044a2 (:art: search-work style: 검색 결과 카드 레이아웃 및 UI 퍼블리싱)
=======
=======
>>>>>>> 38e9c96 (:sparkles: search-work feat: 검색 API 응답 구조 변경 및 UI 반영)
.search-section .total-count {
    text-align: right;
    font-size: var(--font-size-sub);
    line-height: 4;
}

<<<<<<< HEAD
>>>>>>> f7c46a3 (:sparkles: search-work feat: 검색 API 응답 구조 변경 및 UI 반영)
=======
>>>>>>> 38e9c96 (:sparkles: search-work feat: 검색 API 응답 구조 변경 및 UI 반영)
.search-section .works-list-container .work-box {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: stretch;
    column-gap: 12px;
    margin-bottom: 3rem;
    padding: 12px;
<<<<<<< HEAD
=======
.search-section .work-box {
>>>>>>> 8d610c7 (:art: search-work style: search input 퍼블리싱)
=======
>>>>>>> e0044a2 (:art: search-work style: 검색 결과 카드 레이아웃 및 UI 퍼블리싱)
    cursor: pointer;
    z-index: 1;
}

.search-section .work-box .img-box {
<<<<<<< HEAD
<<<<<<< HEAD
    /* TODO: 반응형 고려 */
    /* width: clamp(100px, 25vw, 140px); */
    width: 100px;
=======
    width: clamp(100px, 25vw, 140px);
>>>>>>> e0044a2 (:art: search-work style: 검색 결과 카드 레이아웃 및 UI 퍼블리싱)
=======
    /* TODO: 반응형 고려 */
    /* width: clamp(100px, 25vw, 140px); */
    width: 100px;
>>>>>>> 678a48e (:art: search-work style: 포스터 크기 고정)
    aspect-ratio: 2 / 3;
    grid-row: 1 / 3;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
}

.search-section .work-box .img-box img {
    object-fit: cover;
    object-position: center;
    width: 100%;
    height: 100%;
}

.search-section .work-box .work-info-box {
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.search-section .work-box .work-title-box {
    min-width: 0;
    padding-bottom: 0;
}

.search-section .work-box .work-title-box .media-type {
    display: inline-block;
    padding: 4px 8px;
    /* NOTICE:: tv, movie, person에 따라 칩 변경할 경우 변경 사항 */
    background-color: var(--chip-default-bg);
    border-radius: 8px;
    line-height: 1;
}

.search-section .work-box .work-title-box .work-title {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
}

.search-section .work-box .work-title-box .work-name {
    min-width: 0;
<<<<<<< HEAD
<<<<<<< HEAD
    max-width: calc(100% - 4rem);
=======
    flex: 1;
>>>>>>> e0044a2 (:art: search-work style: 검색 결과 카드 레이아웃 및 UI 퍼블리싱)
=======
    max-width: calc(100% - 4rem);
>>>>>>> 678a48e (:art: search-work style: 포스터 크기 고정)
}

.search-section .work-box .work-title-box .release-year {
    flex-shrink: 0;
}

.search-section .work-box .story-box {
    min-width: 0;
    margin-top: auto;
}

.search-section .work-box .story-box.empty {
    margin-top: 1.2rem;
}

.search-section .work-box .story-box .story {
    margin: 0;
}


.search-section .work-box .story-box:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 7.2rem);
    background-color: var(--bg-surface);
    border-radius: 8px;
    box-shadow: 0px 0px 8px #00000013;
    z-index: -1;
}
</style>