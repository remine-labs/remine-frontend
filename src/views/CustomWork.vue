<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../api/client";

const props = defineProps<{
  embedded?: boolean;
  workId?: number;
}>();

const emit = defineEmits<{
  registered: [
    work: {
      workId: number;
      workTitle: string;
      workPosterPath: string;
      workReleaseDate?: string;
      mediaType: string;
      workSource: string;
    },
  ];
  cancel: [];
}>();

const router = useRouter();

const workTitle = ref("");
const mediaType = ref<"movie" | "tv">("movie");
const memo = ref("");
const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref("");

onMounted(async () => {
  if (!props.workId) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const res = await api.get(`/api/custom-works/${props.workId}`);
    const data = res.data.data;

    workTitle.value = data.workTitle;
    mediaType.value = data.mediaType;
    memo.value = data.memo || "";
  } catch (error) {
    errorMessage.value = "등록한 작품 정보를 불러오지 못했습니다.";
    console.error("작품 정보 조회 실패:", error);
  } finally {
    isLoading.value = false;
  }
});

const addWork = async () => {
  if (!workTitle.value.trim()) return;

  isSaving.value = true;
  errorMessage.value = "";

  try {
    const payload = {
      workTitle: workTitle.value.trim(),
      mediaType: mediaType.value,
      memo: memo.value.trim(),
    };
    const res = props.workId
      ? await api.patch(`/api/custom-works/${props.workId}`, payload)
      : await api.post("/api/custom-works", payload);

    const data = res.data.data || {};
    const workId = data.id ?? props.workId;
    if (typeof workId !== "number") {
      throw new Error("저장된 작품 ID가 응답에 없습니다.");
    }
    const work = {
      workId,
      workTitle: data.workTitle || payload.workTitle,
      workPosterPath: data.workPosterPath || "",
      workReleaseDate: data.workReleaseDate,
      mediaType: data.mediaType || payload.mediaType,
      workSource: "CUSTOM",
    };

    if (props.embedded) {
      emit("registered", work);
      return;
    }

    router.push({
      path: "/review/create",
      state: work,
    });
  } catch (error) {
    errorMessage.value = props.workId
      ? "작품 정보를 수정하지 못했습니다."
      : "작품을 등록하지 못했습니다.";
    console.error("작품 저장 실패:", error);
  } finally {
    isSaving.value = false;
  }
};

const handleCancel = () => {
  if (props.embedded) {
    emit("cancel");
    return;
  }

  router.back();
};
</script>

<template>
  <main class="custom-work">
    <div class="wrap">
      <p v-if="isLoading">등록한 작품 정보를 불러오고 있어요.</p>
      <div class="custom-work-container">
        <div class="input-box media-type-box">
          <span>종류</span>
          <div class="radio">
            <input
              type="radio"
              id="radio-movie"
              name="mediaType"
              value="movie"
              v-model="mediaType"
              :disabled="isLoading || isSaving || !!errorMessage"
            />
            <label for="radio-movie">영화</label>
          </div>
          <div class="radio">
            <input
              type="radio"
              id="radio-tv"
              name="mediaType"
              value="tv"
              v-model="mediaType"
              :disabled="isLoading || isSaving || !!errorMessage"
            />
            <label for="radio-tv">TV 프로그램</label>
          </div>
        </div>

        <div class="input-box work-title-box">
          <span>작품명: </span>
          <div class="input-text">
            <input
              type="text"
              v-model="workTitle"
              placeholder="작품명을 입력하세요"
              required
              :disabled="isLoading || isSaving || !!errorMessage"
            />
          </div>
        </div>

        <textarea
          v-model="memo"
          placeholder="등장인물, 줄거리 등 내용을 자유롭게 입력해주세요."
          :disabled="isLoading || isSaving || !!errorMessage"
        ></textarea>
      </div>

      <div class="btn-box">
        <button
          type="button"
          class="neutral-btn"
          @click="handleCancel"
          :disabled="isLoading || isSaving || !!errorMessage"
        >
          취소
        </button>
        <button
          type="button"
          class="active-btn add-work-btn"
          @click="addWork"
          :disabled="isLoading || isSaving"
        >
          {{ isSaving ? "저장 중..." : props.workId ? "수정" : "등록" }}
        </button>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div v-if="!embedded" class="notification">
        등록 버튼을 누르면, 리뷰 작성 페이지로 이동합니다.
      </div>
    </div>
  </main>
</template>

<style>
.custom-work .custom-work-container .input-box,
.custom-work .custom-work-container textarea {
  margin-top: 16px;
}

.custom-work .media-type-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.custom-work .media-type-box span {
  margin-right: 15px;
}

.custom-work .media-type-box .radio {
  display: flex;
  gap: 6px;
  align-items: center;
}

.custom-work .media-type-box .radio label {
  flex-shrink: 0;
}

.custom-work .work-title-box {
  display: flex;
  gap: 10px;
  align-items: center;
}

.custom-work textarea {
  width: 100%;
  aspect-ratio: 1/ 0.4;
}

.custom-work .btn-box {
  display: flex;
  gap: 10px;
  justify-content: right;
  margin: 30px 0 20px;
}

.custom-work .notification {
  text-align: right;
  color: var(--text-sub);
}
</style>
