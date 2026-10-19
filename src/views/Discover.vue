<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api } from "../api/client";
import { getRecommendations, type RecommendedWork } from "../api/recommend";
import WorkCard from "../components/WorkCard.vue";
import {
  addWatchlist,
  deleteWatchlist,
  getWatchlistStatus,
} from "../api/watchlist";

const topTags = ref<string[]>([]);
type DiscoverWork = RecommendedWork & { isWatchlisted: boolean };
const recommendations = ref<DiscoverWork[]>([]);
const isLoadingRecommendations = ref(true);
const recommendationsError = ref("");
const pendingWatchlistUpdates = ref(new Set<string>());

const movieRecommendations = computed(() =>
  recommendations.value.filter((work) => work.mediaType === "movie"),
);
const tvRecommendations = computed(() =>
  recommendations.value.filter((work) => work.mediaType === "tv"),
);

const getWorkKey = (work: RecommendedWork) =>
  `${work.mediaType}-${work.workId}`;

const getTopTags = async () => {
  try {
    const response = await api.get("/api/reviews/toptag");
    topTags.value = response.data.data;
  } catch (error) {
    console.error("인기 태그 조회 실패:", error);
  }
};

const getRecommendationsList = async () => {
  try {
    const response = await getRecommendations();
    recommendations.value = await Promise.all(
      response.data.data.map(async (work) => {
        const status = await getWatchlistStatus(work.mediaType, work.workId);
        return {
          ...work,
          isWatchlisted: status.data.data.inWatchlist,
        };
      }),
    );
  } catch (error) {
    console.error("추천 작품 조회 실패:", error);
    recommendationsError.value =
      "추천 작품을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    isLoadingRecommendations.value = false;
  }
};

const toggleWatchlistHandler = async (work: DiscoverWork) => {
  const key = getWorkKey(work);
  if (pendingWatchlistUpdates.value.has(key)) return;

  pendingWatchlistUpdates.value = new Set(pendingWatchlistUpdates.value).add(
    key,
  );
  try {
    if (work.isWatchlisted) {
      await deleteWatchlist(work.mediaType, work.workId);
    } else {
      await addWatchlist({
        workId: work.workId,
        mediaType: work.mediaType,
        workTitle: work.workTitle,
        workPosterPath: work.workPosterPath,
      });
    }

    work.isWatchlisted = !work.isWatchlisted;
  } catch (error) {
    console.error("관심 작품 변경 실패:", error);
  } finally {
    const pendingUpdates = new Set(pendingWatchlistUpdates.value);
    pendingUpdates.delete(key);
    pendingWatchlistUpdates.value = pendingUpdates;
  }
};

onMounted(() => {
  getTopTags();
  getRecommendationsList();
});
</script>

<template>
  <!-- TODO: 작품 개수 12개, 작품이 많이 받은 태그 노출, 장르 표기 필수
     작품 정보 클릭시 WorkDetail로 이동
     WorkCard 활용할 것
     watchlist 등록/삭제도 가능해야 함 -->
  <main class="discover">
    <div class="wrap">
      <section class="top-tags">
        <h3>작성하신 리뷰에서 추출한 상위 키워드입니다.</h3>
        <div class="tags title">
          <span class="tag" v-for="tag in topTags" :key="tag">
            {{ tag }}
          </span>
        </div>
      </section>
      <section class="recommend">
        <p v-if="isLoadingRecommendations">추천 작품을 불러오는 중입니다.</p>
        <p v-else-if="recommendationsError">{{ recommendationsError }}</p>
        <p v-else-if="recommendations.length === 0">
          리뷰를 작성하면 취향을 더 잘 반영한 다양한 작품을 추천해 드릴게요.
        </p>
        <template v-else>
          <div class="works-container movie">
            <h4 class="title">영화</h4>
            <p v-if="movieRecommendations.length === 0">
              현재 해당 미디어에서는 추천드릴 작품을 찾지 못했습니다.
            </p>
            <div v-else class="works-list-container">
              <WorkCard
                v-for="work in movieRecommendations"
                :key="`movie-${work.workId}`"
                v-bind="work"
                :watchlist-disabled="
                  pendingWatchlistUpdates.has(getWorkKey(work))
                "
                @toggle-watchlist="toggleWatchlistHandler(work)"
              />
            </div>
          </div>
          <div class="works-container tv">
            <h4 class="title">TV</h4>
            <p v-if="tvRecommendations.length === 0">
              현재 해당 미디어에서는 추천드릴 작품을 찾지 못했습니다.
            </p>
            <div v-else class="works-list-container">
              <WorkCard
                v-for="work in tvRecommendations"
                :key="`tv-${work.workId}`"
                v-bind="work"
                :watchlist-disabled="
                  pendingWatchlistUpdates.has(getWorkKey(work))
                "
                @toggle-watchlist="toggleWatchlistHandler(work)"
              />
            </div>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<style>
.discover {
  .top-tags {
    text-align: center;
    margin-bottom: 40px;

    h3 {
      font-size: var(--font-size-body);
      font-weight: 400;
      margin-bottom: 10px;
    }
    .tags {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-title);

      .tag {
        white-space: nowrap;
        padding: 2px 8px;
        border-radius: 8px;
        line-height: 1;
        background-color: var(--chip-default-bg);
        color: #2d2f35;
      }
    }
  }

  .recommend {
    .works-container {
      &.movie {
        margin-bottom: 30px;
      }

      .title {
        margin-bottom: 10px;
      }

      p {
        text-align: center;
      }
    }
  }
}
</style>
