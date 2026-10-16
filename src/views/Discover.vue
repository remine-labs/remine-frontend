<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../api/client";

const topTags = ref<string[]>([]);

const getTopTags = async () => {
  try {
    const response = await api.get("/api/reviews/toptag");
    topTags.value = response.data.data;
  } catch (error) {
    console.error("인기 태그 조회 실패:", error);
  }
};

onMounted(() => {
  getTopTags();
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
        <h3 class="title">작성하신 리뷰에서 추출한 상위 키워드입니다.</h3>
        <div class="tag" v-for="tag in topTags" :key="tag">
          {{ tag }}
        </div>
      </section>
      <section class="recommend">
        <h3 class="title">좋아할 만한 작품을 골라봤어요.</h3>
        <div class="works-container movie">
          <h4 class="title">영화</h4>
          <div class="works-list-container"></div>
        </div>
        <div class="works-container tv">
          <h4 class="title">TV</h4>
          <div class="works-list-container"></div>
        </div>
      </section>
    </div>
  </main>
</template>

<style></style>
