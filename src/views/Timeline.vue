<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api/client'

</script>

<template>
    <section class="timeline-section">
        <div class="wrap">
            <div class="filter-container">
                <div class="filter-box sort-date">
                    <button>최신 순</button>
                    <button>오래된 순</button>
                    <button>감상일 순</button>
                </div>
                <div class="filter-box sort-rating">
                    <button>4점 이상</button>
                    <button>3점 이상</button>
                    <button>2점 이상</button>
                    <button>1점 이상</button>
                    <button>1점 미만</button>
                </div>
            </div>
            <div class="timeline-container">
                <div class="timeline-box">
                    <div class="img-box">
                        <img src="https://picsum.photos/120/180" />
                    </div>
                    <div class="work-info-box">
                        <h3 class='work-title'>work title</h3>
                        <span class="release-year">(YYYY)</span>
                    </div>
                    <div class="review-text-box">
                        review text placeholder
                    </div>
                    <div class="rating-box">
                        rating
                    </div>
                    <div class="creation-information-box">
                        <div class="tags-box">
                            <span>tag</span>
                        </div>
                        <div class="created-date">
                            created date
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>