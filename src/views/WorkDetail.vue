<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { api } from '../api/client'
import { useRoute, useRouter } from 'vue-router'
import { PhHeart, PhPenNib } from '@phosphor-icons/vue'
import { addWatchlist, deleteWatchlist, getWatchlist, type Watchlist } from '../api/watchlist'
// import { getMyReviewByWork } from "../api/review";

const route = useRoute()
const router = useRouter()

const mediaType = route.params.mediaType as string
const workId = route.params.workId as string


export interface Actor {
    name: string
    profilePath: string
}

export interface WorkDetail {
    workId: number
    workTitle: string
    originalTitle: string

    genres: string[]
    workReleaseDate: string
    workOverview: string

    workPosterPath: string
    mediaType: string

    runtime: number

    watchProviders: string[]

    directors: string[]
    writers: string[]

    actors: Actor[]

    certification: string

    numberOfSeasons: number | null
    numberOfEpisodes: number | null
}

interface Review {
    reviewId: number
    comment: string
    rating: number
}

type MyReview = {
    reviewId: number;
    rating: number;
    startDate: string;
    endDate: string | null;
};


const work = ref<WorkDetail | null>(null)
const reviews = ref<Review[]>([])

const loading = ref(false)
const error = ref('')

const isWatchlisted = ref(false)

const myReview = ref<MyReview | null>(null);

const showSeason = computed(
    () => (work.value?.numberOfSeasons ?? 0) > 1
)

const formatPeople = (people: string[]) => {
    if (!people.length) return '';
    if (people.length === 1) return people[0];

    return `${people[0]} 외 ${people.length - 1}명`;
};

const formatReviewDate = (
    startDate: string,
    endDate: string | null
) => {
    const start = startDate.replace(/-/g, ".");
    const end = endDate
        ? endDate.replace(/-/g, ".")
        : "감상 중";

    return `${start} ~ ${end}`;
};

const directorText = computed(() => formatPeople(work.value?.directors ?? []));
const writerText = computed(() => formatPeople(work.value?.writers ?? []));
// TODO: 중복 값 어떻게 처리할 것인지
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

const goToCreate = () => {
    router.push({
        path: "/review/create",
        state: {
            workId: work.value?.workId,
            workTitle: work.value?.workTitle,
            workPosterPath: work.value?.workPosterPath,
            workReleaseDate: work.value?.workReleaseDate,
            mediaType: work.value?.mediaType,
            workSource: "TMDB"
        },
    })
}

// const getMyReview = async () => {
//     try {
//         const response = await getMyReviewByWork(
//             mediaType,
//             Number(workId)
//         );

//         myReview.value = response.data.data[0] ?? null;
//     } catch (error) {
//         console.error("내 리뷰 조회 실패:", error);
//     }
// };

const toggleWatchlistHandler = async () => {
    if (!work.value) return

    try {
        if (isWatchlisted.value) {
            await deleteWatchlist(work.value.mediaType, work.value.workId)
        } else {
            await addWatchlist({
                workId: work.value.workId,
                mediaType: work.value.mediaType,
                workTitle: work.value.workTitle,
                workPosterPath: work.value.workPosterPath,
                workReleaseDate: work.value.workReleaseDate,
            })
        }

        isWatchlisted.value = !isWatchlisted.value
    } catch (error) {
        console.error(error)
    }
}

const getWorkDetail = async () => {
    try {
        loading.value = true

        const res = await api.get(
            `/api/tmdb/contents/${mediaType}/${workId}`
        )

        work.value = res.data.data

        const watchlistRes = await getWatchlist()

        isWatchlisted.value = watchlistRes.data.data.content.some(
            (item: Watchlist) => item.workId === work.value?.workId
        )
    } catch (err) {
        console.error(err)
        error.value = '작품 정보를 불러오지 못했습니다.'
    } finally {
        loading.value = false
    }
}

// const getReviewsByWorkId = async () => {
//     try {
//         const res = await api.get(`/api/reviews/work/${workId}`)
//         reviews.value = res.data.data ?? []
//     } catch (err) {
//         console.error(err)
//         reviews.value = []
//     }
// }

// TODO: 하단에 '내가 쓴 리뷰' 부분 연결
// const goToReviewDetail = (reviewId: number) => {
//     router.push(`/review/${reviewId}`)
// }

getWorkDetail()
// getReviewsByWorkId()
// onMounted(() => {
//     getMyReview();
// });
</script>

<template>
    <section class="work-detail-section">
        <div class="work-bg-box relative">
            <div class="img-box add-overlay">
                <img :src="`https://image.tmdb.org/t/p/original${work?.workPosterPath}`" :alt="work?.workTitle" />
            </div>
        </div>
        <div class="wrap">
            <div class="work-info-container relative">
                <div class="img-box poster">
                    <img :src="`https://image.tmdb.org/t/p/w200${work?.workPosterPath}`" :alt="work?.workTitle" />
                </div>
                <div class="work-info-box">
                    <div class="work-meta-box">
                        <span class="age-rating" :class="`age-${work?.certification}`">{{ work?.certification
                            }}</span>

                        <div class="genre-box description">
                            <span class="genre" v-for='genre in work?.genres' :key='genre'>{{ genre }}</span>
                        </div>
                    </div>
                    <h2 class="work-title ellipsis-2">{{ work?.workTitle }}</h2>
                    <div class="work-detail-box">
                        <p class="release-date">
                            {{ work?.workReleaseDate?.replace(/-/g, '.') }}
                            {{ work?.mediaType === 'tv' ? '공개' : '개봉' }}
                        </p>
                        <p class="runtime" v-if="work?.mediaType === 'movie'">상영 시간: {{ work?.runtime }}분</p>
                        <p class="tv-info">
                            <span v-if="showSeason">
                                전체 {{ work?.numberOfSeasons }} 시즌
                            </span>
                            <span v-if="showSeason && work?.numberOfEpisodes">
                                ·
                            </span>
                            <span class="episode-info" v-if="work?.numberOfEpisodes">총 {{
                                work?.numberOfEpisodes }}부작</span>
                        </p>
                    </div>
                    <div class="directors-box description" v-if="work?.directors?.length">
                        감독: <span class="director">{{ directorText }}</span>
                    </div>

                    <div class="writers-box description" v-if="work?.writers?.length">
                        각본: <span class="writer">{{ writerText }}</span>
                    </div>
                </div>
            </div>
            <div class="actor-container">
                <h3>출연진</h3>
                <div class="actor-list-box">
                    <div class="actor-box" v-for="actor in work?.actors" :key="actor.name">
                        <div class="img-box">
                            <img v-if="actor.profilePath" :src="`https://image.tmdb.org/t/p/w200${actor.profilePath}`"
                                :alt="actor.name" />
                        </div>
                        <span class="actor-name description ellipsis-2">
                            {{ actor.name }}
                        </span>
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
                <!-- TODO: OTT 정보 연결
                 요금제 따라 차등이 존재하는 경우 어떻게 할지 고민
                 각 OTT 사이트의 검색 페이지까지 연결은 가능하겠지만, 실제 작품까지는 연결 어려움
                 cf) 파라마운트에서만 제공하는 작품 체크 필요 나는 학교에서 죽었다 -->
                <!-- TODO: JustWatch에서 제공한다는 내용 기재 필수, 법적 문제임 -->
                <!-- TODO: 유저가 사용하는 OTT 정보 받을 경우 구분해서 노출 -->
                <div class="ott-box">
                    <div class="ott" v-for='provider in work?.watchProviders' :key='provider'>{{
                        providerMap[provider]
                        ||
                        provider
                    }}</div>
                </div>
            </div>
            <div class="review-list-box">
                <h3>내가 쓴 리뷰</h3>

                <template v-if="myReview">
                    <div class="review-summary" @click="router.push(`/review/${myReview.reviewId}`)">
                        <span>
                            {{ formatReviewDate(myReview.startDate, myReview.endDate) }}
                        </span>
                        <span>{{ myReview.rating }}/5</span>
                    </div>
                </template>

                <p v-else>
                    아직 리뷰가 없어요.<br />
                    리뷰를 쓰고 내 취향의 작품을 추천받아 보세요.
                </p>
            </div>
        </div>
        <div class="floating-box">
            <div class="icon-box watchlist">
                <button @click="toggleWatchlistHandler">
                    <PhHeart :weight="isWatchlisted ? 'fill' : 'regular'" :size="24" />
                </button>
            </div>
            <div class="icon-box review-create">
                <button @click="goToCreate">
                    <PhPenNib :size="24" />
                </button>
            </div>
        </div>
    </section>
</template>

<style>
.work-detail-section {
    padding-top: var(--header-height);
}

.work-detail-section .floating-box .icon-box.watchlist {
    background-color: var(--bg-surface);
    color: var(--heart);
    margin-bottom: 10px;
}

.work-detail-section .floating-box .icon-box.review-create {
    background-color: var(--btn-active-bg);
    color: var(--text-inverse);
}

.work-detail-section .work-bg-box {
    aspect-ratio: 3 / 2;
}

.work-detail-section .work-bg-box .img-box {
    height: 100%;
    overflow: hidden;
}

.work-detail-section .work-bg-box img {
    margin-top: -15%;
    filter: blur(3px);
    transform: scale(1.1);
}

.work-detail-section .wrap>div {
    margin-bottom: 30px;
}

.work-detail-section .wrap .work-info-container {
    margin-top: -22%;
    background-color: var(--bg-elevated);
    border-radius: 8px;
    padding: 14px;
    box-shadow: var(--box-default);
}

.work-detail-section .work-info-container .img-box {
    position: absolute;
    bottom: 14px;
    left: 14px;
    width: calc(50% - 14px - 8px);
    border-radius: 8px;
    overflow: hidden;
}

.work-detail-section .work-info-container .img-box img {
    object-fit: cover;
}

.work-detail-section .work-info-container .work-info-box {
    margin-left: calc(50% + 8px);
    min-height: 160px;
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

.work-detail-section .work-meta-box .age-rating.age-null {
    display: none;
}

.work-detail-section .work-meta-box .age-rating {
    font-weight: 600;
}

.work-detail-section .work-meta-box .age-rating.age-ALL {
    background-color: #3fa856;
    color: var(--text-static-wh);
}

.work-detail-section .work-meta-box .age-rating.age-12 {
    background-color: #f08018;
    color: var(--text-static-bk);
}

.work-detail-section .work-meta-box .age-rating.age-15 {
    background-color: #fced1f;
    color: var(--text-static-bk);
}

.work-detail-section .work-meta-box .age-rating.age-19 {
    background-color: #c01313;
    color: var(--text-static-wh);
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
    font-size: 2rem;
    font-weight: 400;
    font-family: var(--font-family-logo);
    line-height: 1.2;
    margin: 10px 0;
}

.work-detail-section .work-info-box .work-detail-box {
    color: var(--text-sub);
    margin-bottom: 12px;
}

.work-detail-section .work-info-box .work-detail-box p,
.work-detail-section .work-info-box .directors-box {
    margin-bottom: 2px;
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
    font-size: 1.6rem;
    font-weight: 500;
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
    gap: 4px;
    flex-direction: column;
    align-items: center;
    width: calc((100% - 35px)/6);
    flex-shrink: 0;
    word-break: keep-all;
    text-align: center;
}

.work-detail-section .actor-list-box .img-box {
    width: 100%;
    aspect-ratio: 1/1;
    background-color: #afafaf;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
}

.work-detail-section .actor-list-box .img-box img {
    margin-top: -7%;
}

.work-detail-section .work-info-box,
.work-detail-section .actor-list-box .actor-name {
    font-size: var(--font-size-sub)
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

@media screen and (min-width: 460px) {
    .work-detail-section .work-info-container .img-box {
        width: calc(40% - 7px - 8px);
    }

    .work-detail-section .work-info-container .work-info-box {
        margin-left: calc(40% + 8px);
    }
}

@media screen and (min-width: 520px) {
    .work-detail-section .work-bg-box {
        aspect-ratio: 5 / 3;
    }

    .work-detail-section .work-info-container .work-info-box {
        min-height: 180px;
    }

    .work-detail-section .work-info-box .work-detail-box {
        color: var(--text-sub);
        margin-bottom: 16px;
    }

    .work-detail-section .work-info-box .work-detail-box p,
    .work-detail-section .work-info-box .directors-box {
        margin-bottom: 4px;
    }

    .work-detail-section .actor-list-box .actor-box {
        width: calc((100% - 42px)/7);
    }
}

@media screen and (min-width: 560px) {
    .work-detail-section .work-info-container .work-info-box {
        min-height: 200px;
    }
}

@media screen and (min-width: 640px) {
    .work-detail-section .work-bg-box {
        aspect-ratio: 7 / 4;
    }

    .work-detail-section .work-info-container .work-info-box {
        margin-left: calc(40% + 8px);
        min-height: 220px;
    }

    .work-detail-section .work-info-box,
    .work-detail-section .actor-list-box .actor-name {
        font-size: var(--font-size-long);
    }

    .work-detail-section .actor-list-box .actor-box {
        width: calc((100% - 49px)/8);
    }
}

@media screen and (min-width: 690px) {
    .work-detail-section .work-bg-box {
        aspect-ratio: 11 / 5;
    }

    .work-detail-section .wrap .work-info-container {
        margin-top: -16%;
    }

    .work-detail-section .work-info-container .img-box {
        width: calc(30% - 7px - 8px);
    }

    .work-detail-section .work-info-container .work-info-box {
        margin-left: calc(30% + 8px);
        min-height: 160px;
    }

    .work-detail-section .actor-list-box .actor-box {
        width: calc((100% - 56px)/9);
    }
}
</style>
