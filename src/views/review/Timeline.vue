<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { PhCaretDown } from "@phosphor-icons/vue";
import { api } from "../../api/client";
import Pagination from "../../components/Pagination.vue";

const router = useRouter();

interface Tag {
  label: string;
  category: string | null;
  sentiment: string | null;
}

interface Review {
  reviewId: number;
  workId: number;
  workTitle: string;
  workPosterPath: string;
  workReleaseDate: string;
  mediaType: string;
  comment: string;
  rating: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

interface TimelinePage {
  content: Review[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

interface ApiResponse<T> {
  data: T;
}

const filters = [
  { label: "최신 순", value: "LATEST" },
  { label: "오래된 순", value: "OLDEST" },
  { label: "높은 평점 순", value: "HIGH_RATING" },
  { label: "낮은 평점 순", value: "LOW_RATING" },
];

const selectedFilter = ref("LATEST");
const isFilterOpen = ref(false);
const filterContainer = ref<HTMLElement | null>(null);

const currentPage = ref(1);
const totalPages = ref(0);
const loading = ref(false);
const timeline = ref<Review[]>([]);

const formatDisplayDate = (date: string | Date | null) => {
  if (!date) return "";

  const d = new Date(date);

  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yy}.${mm}.${dd}`;
};

const goToReviewDetail = (reviewId: number) => {
  router.push(`/review/${reviewId}`);
};

const fetchTimeline = async (page: number) => {
  loading.value = true;

  try {
    const res = await api.get<ApiResponse<TimelinePage>>(
      "/api/reviews/timeline",
      {
        params: {
          page,
          sortType: selectedFilter.value,
        },
      },
    );

    timeline.value = res.data.data.content;
    currentPage.value = page;
    totalPages.value = res.data.data.totalPages;
  } catch (error) {
    console.error("timeline 조회 실패", error);
    timeline.value = [];
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

const changeFilter = (filter: string) => {
  selectedFilter.value = filter;
  isFilterOpen.value = false;
  fetchTimeline(1);
};

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const closeFilterOnOutsideClick = (event: MouseEvent) => {
  if (
    event.target instanceof Node &&
    !filterContainer.value?.contains(event.target)
  ) {
    isFilterOpen.value = false;
  }
};

onMounted(() => {
  fetchTimeline(1);
  document.addEventListener("click", closeFilterOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeFilterOnOutsideClick);
});
</script>

<template>
  <section class="timeline-section">
    <div class="wrap">
      <div ref="filterContainer" class="filter-container relative">
        <button
          type="button"
          class="selected-filter"
          :class="{ active: isFilterOpen }"
          @click.stop="toggleFilter"
        >
          <span>{{
            filters.find((filter) => filter.value === selectedFilter)?.label
          }}</span>
          <span class="icon">
            <PhCaretDown weight="fill" aria-hidden="true" />
          </span>
        </button>
        <div class="filter-box" :class="{ active: isFilterOpen }">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            :class="{ active: selectedFilter === filter.value }"
            @click="changeFilter(filter.value)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
      <div class="timeline-container">
        <div
          class="timeline-box"
          v-for="item in timeline"
          :key="item.reviewId"
          @click="goToReviewDetail(item.reviewId)"
        >
          <div class="head-box">
            <div class="img-box">
              <img
                :src="`https://image.tmdb.org/t/p/w200${item.workPosterPath}`"
                :alt="item.workTitle"
              />
            </div>

            <div class="work-info-box">
              <h3 class="work-title">{{ item.workTitle }}</h3>
              <span class="release-year number">
                ({{ item.workReleaseDate?.slice(0, 4) }})
              </span>
            </div>
            <div class="created-date number">
              {{ formatDisplayDate(item.createdAt) }}
            </div>
          </div>
          <div class="review-text-box ellipsis-2">
            {{ item.comment }}
          </div>
          <div class="footer-box chips">
            <span class="media-type chip important">{{
              item.mediaType.toUpperCase()
            }}</span>
            <template v-if="item?.tags?.length">
              <span
                v-for="tag in item.tags"
                :key="tag.label"
                class="tag-item chip default"
              >
                {{ tag.label }}
              </span>
            </template>
            <span class="rating chip"> {{ item.rating }} /5 </span>
          </div>
        </div>
      </div>
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="fetchTimeline"
      />
    </div>
  </section>
</template>

<style>
.timeline-section {
  .filter-container {
    .selected-filter {
      display: flex;
      align-items: cetner;
      gap: 4px;
      span {
        flex-shrink: 0;
      }
    }
  }
}

.timeline-section .timeline-box {
  padding: 14px;
  margin-top: 20px;
  border-radius: 8px;
  background-color: var(--bg-elevated);
  box-shadow: var(--box-default);
}

.timeline-section .timeline-box .head-box {
  display: flex;
  gap: 6px;
  align-items: center;
}

.timeline-section .timeline-box .head-box .img-box {
  width: 45px;
  height: 45px;
  border-radius: 45px;
  overflow: hidden;
}

.timeline-section .head-box .img-box img {
  margin-top: -10%;
}

.timeline-section .head-box .created-date {
  color: var(--text-sub);
}

.timeline-section .head-box .work-info-box {
  flex-shrink: 0;
  width: calc(100% - 12px - 45px - 54px);
  display: flex;
  align-items: center;
  gap: 4px;
}

.timeline-section .head-box .work-info-box .work-title {
  font-weight: 500;
  font-size: var(--font-size-body);
  max-width: calc(100% - 46px);
}

.timeline-section .timeline-box .review-text-box {
  margin: 16px 0 12px;
  font-size: var(--font-size-long);
  color: var(--text-sub);
}
</style>
