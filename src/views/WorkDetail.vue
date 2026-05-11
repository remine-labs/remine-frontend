<script setup lang='ts'>
import { ref } from 'vue'
import { api } from '../api/client'
import { useRoute, useRouter } from 'vue-router'
import { PhHeart, PhPenNib } from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()



const mediaType = route.params.mediaType as string
const workId = route.params.workId as string

interface WorkDetail {
    workId: number
    workTitle: string
    originalTitle: string
    genres: string[]
    workReleaseDate: string
    workOverview: string
    workPosterPath: string
    workVoteAverage: number
    mediaType: string
    watchProviders: string[]
    directors: string[]
    writers: string[]
    actors: string[]
    certification: string
}


const work = ref<WorkDetail | null>(null)
const loading = ref(false)
const error = ref('')

const getWorkDetail = async () => {
    try {
        loading.value = true
        const res = await api.get(
            `/api/tmdb/contents/${mediaType}/${workId}`
        )

        work.value = res.data.data
    } catch (err) {
        console.error(err)
        error.value = '작품 정보를 불러오지 못했습니다.'
    } finally {
        loading.value = false;
    }
}


const goToCreate = () => {
    router.push({
        path: '/review/create',
        state: {
            id: work.value?.workId,
            title: work.value?.workTitle,
            poster: work.value?.workPosterPath,
            releaseDate: work.value?.workReleaseDate
        },
    })
}

const providerMap: Record<string, string> = {
    'Netflix Standard with Ads': 'Netflix',
    'Netflix': 'Netflix',

    'Disney Plus': 'Disney+',
    'Disney+': 'Disney+',

    'Amazon Prime Video': 'Prime Video',
    'Amazon Video': 'Prime Video',

    'Apple TV': 'Apple TV+',
    'Apple TV Plus': 'Apple TV+',
    'Apple TV+': 'Apple TV+',

    'Watcha': 'WATCHA',
    'WATCHA': 'WATCHA',

    'wavve': 'wavve',
    'Wavve': 'wavve',

    'TVING': 'TVING',
    'Tving': 'TVING',

    'Coupang Play': 'Coupang Play',

    'Laftel': 'Laftel',

    'Google Play Movies': 'Google Play',

    'YouTube Premium': 'YouTube',
    'YouTube': 'YouTube',
}


getWorkDetail()
</script>

<template>
    <section class="work-detail-section">
        <div class="floating-box">
            <div class="icon-box watchlist">
                <button>
                    <PhHeart :size='24'></PhHeart>
                </button>
            </div>
            <div class="icon-box review-create" @click="goToCreate">
                <button>
                    <PhPenNib :size="24" />
                </button>
            </div>
        </div>
        <div class="work-bg-box relative">
            <div class="img-box">
                <img :src="`https://image.tmdb.org/t/p/original${work?.workPosterPath}`" :alt="work?.workTitle" />
            </div>
            <div class="overlay-box"></div>
            <div class="icon-box watchlist">
                <button>
                    <PhHeart :size='30'></PhHeart>
                </button>
            </div>
        </div>
        <div class="wrap">
            <div class="work-info-container">
                <div class="img-box poster">
                    <img :src="`https://image.tmdb.org/t/p/w200${work?.workPosterPath}`" :alt="work?.workTitle" />
                </div>
                <div class="work-info-box">
                    <div class="work-meta-box">
                        <span class="age-rating" :class="`age-${work?.certification}`">{{ work?.certification }}</span>

                        <div class=" genre-box sub-text">
                            <span class="genre" v-for='genre in work?.genres' :key='genre'>{{ genre }}</span>
                        </div>
                    </div>
                    <h2 class="work-title title ellipsis-2">{{ work?.workTitle }}</h2>
                    <div class="work-detail-box sub-text">
                        <span class="release-date">{{ work?.workReleaseDate?.replace(/-/g, '.') }}</span>
                        <span class="duration">running time</span>
                    </div>
                    <div class="directors-box sub-text">
                        감독:
                        <span class="director" v-for='director in work?.directors' :key='director'>{{ director }}</span>
                    </div>
                    <div class="writers-box sub-text">
                        각본:
                        <span class="writer" v-for='writer in work?.writers' :key='writer'>{{ writer }}</span>
                    </div>
                </div>
            </div>
            <div class="actor-container">
                <h3>출연진</h3>
                <div class="actor-list-box">
                    <div class="actor-box" v-for='actor in work?.actors' :key='actor'>
                        <div class="img-box">
                            img
                        </div>
                        <span class="actor-name ellipsis-2">{{ actor }}</span>
                    </div>
                </div>
            </div>
            <div class=" overview-box">
                <h3>줄거리</h3>
                <div class="overview">
                    {{ work?.workOverview }}
                </div>
            </div>
            <div class="provider-box">
                <h3>시청 가능 OTT</h3>
                <div class="ott-box">
                    <div class="ott" v-for='provider in work?.watchProviders' :key='provider'>{{ providerMap[provider]
                        ||
                        provider
                    }}</div>
                </div>
            </div>
            <div class="review-list-box">
                <h3>내가 쓴 리뷰</h3>
            </div>
        </div>
    </section>
</template>

<style>
.work-detail-section {
    padding-top: 5.8rem;
}

.work-detail-section .floating-box {
    display: flex;
    flex-direction: column;
    align-items: end;
    position: fixed;
    width: 100%;
    max-width: 47.5rem;
    left: 0;
    right: 0;
    bottom: 124px;
    margin: 0 auto;
    z-index: 999;

    pointer-events: none;
}

.work-detail-section .floating-box .icon-box {
    width: 60px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    box-shadow: var(--box-default)
}

.work-detail-section .floating-box .icon-box.watchlist {
    background-color: var(--bg-surface);
    color: var(--heart);
    margin-bottom: 20px;
}

.work-detail-section .floating-box .icon-box.review-create {
    background-color: var(--btn-active-bg);
    color: var(--text-inverse);
}

.work-detail-section .work-bg-box {
    height: 201px;
}

.work-detail-section .work-bg-box .img-box {
    height: 100%;
    overflow: hidden;
}

.work-detail-section .work-bg-box .img-box:before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: #5353533c;
}

.work-detail-section .work-bg-box img {
    margin-top: -15%;
    filter: blur(3px);
    transform: scale(1.1);
}

.work-detail-section .work-bg-box .icon-box {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px;
    color: var(--heart);
}

.work-detail-section .wrap .work-info-container {
    display: flex;
    gap: 16px;
    transform: translateY(-50px);
    background-color: var(--bg-elevated);
    border-radius: 8px;
    padding: 14px;
    box-shadow: 0px 0px 10px #0000000d
}

.work-detail-section .work-info-container .img-box {
    width: calc((100% - 16px)/2 - 8px);
    aspect-ratio: 2/3;
    transform: translateY(-40px);
    margin-bottom: -40px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 0px 10px #0000000d
}

.work-detail-section .work-info-container .work-info-box {
    width: calc((100% - 16px)/2 + 8px)
}

.work-detail-section .work-info-box .work-meta-box {
    display: flex;
    align-items: center;
}

.work-detail-section .work-meta-box .age-rating {
    background-color: #afafaf;
    line-height: 1;
    padding: 5px;
    border-radius: 4px;
    margin-right: 6px;
}

.work-detail-section .work-meta-box .age-rating.age-15 {
    background-color: #fced1f;
    font-weight: 600;
}

.work-detail-section .work-info-box .work-meta-box .genre {
    color: var(--text-sub);
}

.work-detail-section .work-info-box .work-meta-box .genre:after {
    content: ',';
    margin-right: 3px;
}

.work-detail-section .work-info-box .work-meta-box .genre:last-child:after {
    content: '';
    margin-right: 0;
}

.work-detail-section .work-info-box .work-title {
    font-size: 2.2rem;
    margin: 6px 0;
}

.work-detail-section .work-info-box .work-detail-box {
    color: var(--text-sub);
    margin-bottom: 12px;
}

.work-detail-section .work-info-box .work-detail-box .release-date:after {
    content: '·';
    margin: 0 6px;
}

.work-detail-section .work-info-box .directors-box {
    margin-bottom: 8px;
}

.work-detail-section .work-info-box .directors-box,
.work-detail-section .work-info-box .writers-box {
    color: var(--text-sub);
}

.work-detail-section .work-info-box .directors-box .director:after,
.work-detail-section .work-info-box .writers-box .writer:after {
    content: ',';
    margin-right: 3px;
}

.work-detail-section .work-info-box .directors-box .director:last-child:after,
.work-detail-section .work-info-box .writers-box .writer:last-child:after {
    content: '';
    margin-right: 0px;
}

.work-detail-section h3 {
    font-size: 1.8rem;
}

.work-detail-section .actor-list-box {
    display: flex;
    gap: 7px;
    width: 100%;
    overflow: hidden;
    margin-top: 10px;
}

.work-detail-section .actor-list-box .actor-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc((100% - 42px)/7);
    flex-shrink: 0;
    word-break: break-word;
}

.work-detail-section .actor-list-box .img-box {
    width: 100%;
    aspect-ratio: 1/1;
    background-color: #afafaf;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
}

.work-detail-section .overview-box {
    margin-top: 30px;
}

.work-detail-section .overview-box .overview {
    margin-top: 10px;
    font-size: var(--font-size-long);
    text-align: justify;
    color: var(--text-sub);
    background-color: var(--bg-elevated);
    padding: 16px;
    box-shadow: var(--box-default);
}

.work-detail-section .provider-box {
    margin-top: 30px;
}

.work-detail-section .provider-box .ott-box {
    margin-top: 10px;
    display: flex;
    gap: 10px;
}

.work-detail-section .provider-box .ott-box .ott {
    width: 50px;
    aspect-ratio: 1/1;
    border-radius: 6px;
    cursor: pointer;
    background-color: #afafaf;
    word-break: break-all;
    text-align: center;
}

.work-detail-section .review-list-box {
    margin-top: 30px;
}
</style>