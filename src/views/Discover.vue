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
    <section>
        <div v-for="tag in topTags" :key="tag">
            {{ tag }}
        </div>
    </section>
</template>

<style></style>