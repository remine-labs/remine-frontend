import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  createReview,
  patchReview,
  getReviewDetail,
  createTags,
} from "../api/review";
import type { ReviewPayload, PatchReviewPayload } from "../api/review";

export function useReviewForm() {
  const route = useRoute();
  const router = useRouter();

  const reviewIdParam = route.params.reviewId as string | undefined;
  const isEditMode = computed(() => !!reviewIdParam);

  const today = new Date();
  const startDate = ref<Date>(today);
  const endDate = ref<Date | undefined>(today);
  const isWatching = ref(false);
  const isTagModalOpen = ref(false);

  const rating = ref(0);
  const ratingBoxRef = ref<HTMLElement | null>(null);
  const selectedCategories = ref<string[]>([]);
  const comment = ref("");

  const state = history.state as {
    workId?: number;
    workTitle?: string;
    workPosterPath?: string;
    workReleaseDate?: string;
    mediaType?: string;
    workSource?: string;
  };

  // 기존 컴포넌트가 바라보던 work 객체 구조로 통합
  const work = ref({
    id: state?.workId || 0,
    title: state?.workTitle || "",
    poster: state?.workPosterPath || "",
    workReleaseDate: state?.workReleaseDate || "",
    mediaType: state?.mediaType || "",
    workSource: state?.workSource || "TMDB",
  });

  // 날짜 로직을 위한 값 > 자세한 내용은 하단 로직으로
  const isStartToday = computed(() => {
    return startDate.value.toDateString() === today.toDateString();
  });

  const manualTags = [
    { id: "STORY", label: "스토리" },
    { id: "ACTING", label: "연기" },
    { id: "DIRECTING", label: "연출" },
    { id: "VISUAL", label: "영상미" },
    { id: "MUSIC", label: "음악" },
    { id: "IMMERSION", label: "몰입감" },
    { id: "PLOT", label: "전개" },
    { id: "CHARACTER", label: "캐릭터" },
    { id: "EMOTION", label: "감정" },
    { id: "AFTERGLOW", label: "여운" },
    { id: "HUMOR", label: "개그" },
    { id: "ACTION", label: "액션" },
  ];

  const modalDescription = computed(() => {
    return rating.value >= 3
      ? "작품의 좋았던 점을 알려주세요."
      : "작품의 아쉬웠던 점을 알려주세요.";
  });

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return date.toISOString().slice(0, 10);
  };

  onMounted(async () => {
    if (isEditMode.value && reviewIdParam) {
      try {
        const res = await getReviewDetail(Number(reviewIdParam));
        const data = res.data.data;

        comment.value = data.comment || "";
        rating.value = data.rating || 0;
        startDate.value = data.startDate ? new Date(data.startDate) : today;
        isWatching.value = !data.endDate;
        endDate.value = data.endDate ? new Date(data.endDate) : undefined;

        // 수정 모드일 때 API 응답값으로 work 정보 갱신
        work.value = {
          id: data.workId,
          title: data.workTitle,
          poster: data.workPosterPath,
          workReleaseDate: data.workReleaseDate,
          mediaType: data.mediaType,
          workSource: data.workSource || "TMDB",
        };
      } catch (err) {
        console.error("기존 리뷰 데이터를 불러오지 못했습니다.", err);
      }
    }
  });

  const createReviewPayload = (): ReviewPayload => ({
    workId: work.value.id,
    workSource: (work.value.workSource as "TMDB" | "CUSTOM") || "TMDB",
    workTitle: work.value.title,
    workPosterPath: work.value.poster,
    workReleaseDate: work.value.workReleaseDate,
    mediaType: work.value.mediaType,
    comment: comment.value.trim(),
    rating: rating.value,
    startDate: formatDate(startDate.value)!,
    endDate: isWatching.value ? null : formatDate(endDate.value),
  });

  const getErrorMessage = (err: any) => {
    if (err.response)
      return `${err.response.status} - ${err.response.data?.message || "서버 오류"}`;
    if (err.request) return "서버 응답 없음 (네트워크 문제)";
    return err.message;
  };

  // 날짜 변경 로직 ******************************************************
  // 감상중 체크 로직
  watch(isWatching, (val) => {
    if (val) {
      endDate.value = undefined;
    } else {
      if (isEditMode.value) {
        // 수정 모드에서 감상중 해제 시, 오늘 날짜
        endDate.value = new Date();
      } else {
        // 작성 모드에서 감상중 해제 시, 시작일과 동일
        endDate.value = startDate.value;
      }
    }
  });

  // 시작일 로직
  watch(startDate, (newStart) => {
    if (isWatching.value) return;

    //  작성 모드, 시작일 오늘 => 새로운 시작일 생성 => 종료일 == 시작일
    if (!isEditMode.value && isStartToday.value) {
      endDate.value = newStart;
      return;
    }

    //  시작일 > 종료일 방지 => 종료일 == 새로운 시작일
    if (endDate.value && endDate.value < newStart) {
      endDate.value = newStart;
    }
  });

  // 종료일 로직
  watch(endDate, (newEnd) => {
    if (!newEnd || isWatching.value) return;

    //  작성 모드, 시작일 오늘 => 새로운 종료일 => 시작일 == 종료일
    if (!isEditMode.value && isStartToday.value) {
      startDate.value = newEnd;
      return;
    }

    // 시작일 > 종료일 방지 => 시작일 == 새로운 종료일
    if (newEnd < startDate.value) {
      startDate.value = newEnd;
    }
  });

  const getStarFill = (index: number) => {
    if (rating.value >= index) return "100%";
    if (rating.value >= index - 0.5) return "50%";
    return "0%";
  };

  const handleRatingClick = (e: MouseEvent) => {
    if (!ratingBoxRef.value) return;
    const rect = ratingBoxRef.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const raw = ratio * 5;
    const value = Math.ceil(raw * 2) / 2;
    rating.value = Math.min(5, Math.max(0, value));
  };

  const submitReview = async () => {
    const basePayload = createReviewPayload();
    const count = basePayload.comment.replace(/\s/g, "").length;

    if (count < 20) {
      isTagModalOpen.value = true;
      return;
    }

    try {
      let targetReviewId: number;

      if (isEditMode.value && reviewIdParam) {
        targetReviewId = Number(reviewIdParam);

        const patchPayload: PatchReviewPayload = {
          reviewId: targetReviewId,
          ...basePayload,
        };

        await patchReview(patchPayload);
        alert("수정되었습니다. 리뷰 페이지로 이동합니다.");
      } else {
        if (!work.value.id) {
          console.error("작품 정보가 없습니다.");
          return;
        }

        const res = await createReview(basePayload);
        targetReviewId = res.data.data.reviewId;

        await createTags(targetReviewId, { tags: [] });
        alert("저장되었습니다. 리뷰 페이지로 이동합니다.");
      }

      router.push({
        name: "reviewDetail",
        params: { reviewId: targetReviewId },
      });
    } catch (err: any) {
      alert(`요청 실패\n${getErrorMessage(err)}`);
    }
  };

  const submitWithManualTags = async () => {
    if (selectedCategories.value.length === 0) return;

    const basePayload = createReviewPayload();

    try {
      let targetReviewId = reviewIdParam ? Number(reviewIdParam) : undefined;

      if (isEditMode.value && targetReviewId) {
        const patchPayload: PatchReviewPayload = {
          reviewId: targetReviewId,
          ...basePayload,
        };
        await patchReview(patchPayload);
      } else {
        if (!work.value.id) return;
        const res = await createReview(basePayload);
        targetReviewId = res.data.data.reviewId;
      }

      const sentiment: "POSITIVE" | "NEGATIVE" =
        rating.value >= 3 ? "POSITIVE" : "NEGATIVE";
      const tags = selectedCategories.value.map((category) => ({
        category,
        sentiment,
      }));

      if (targetReviewId) {
        await createTags(targetReviewId, { tags });
      }

      alert("저장되었습니다. 리뷰 페이지로 이동합니다.");
      router.push({
        name: "reviewDetail",
        params: { reviewId: targetReviewId },
      });
    } catch (err: any) {
      alert(`요청 실패\n${getErrorMessage(err)}`);
    }
  };

  return {
    work,
    isEditMode,
    startDate,
    endDate,
    isWatching,
    isTagModalOpen,
    rating,
    ratingBoxRef,
    selectedCategories,
    comment,
    manualTags,
    modalDescription,
    getStarFill,
    handleRatingClick,
    submitReview,
    submitWithManualTags,
  };
}
