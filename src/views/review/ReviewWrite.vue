<script setup lang="ts">
import Datepicker from 'vue3-datepicker'
import { PhStar } from '@phosphor-icons/vue'
import { useReviewForm } from '../../composables/useReviewForm'

const {
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
} = useReviewForm()

</script>

<template>
    <section class="review-write-section">
        <div class="work-info-container relative" v-if="work.id">
            <div class="img-box add-overlay">
                <img :src="`https://image.tmdb.org/t/p/original${work.poster}`" :alt="work.title" />
            </div>
        </div>
        <div class="wrap">
            <form @submit.prevent='submitReview'>
                <div class="input-container relative">
                    <div class="date-input-box">
                        <div class="head-box relative">
                            <p>감상일</p>
                            <div class="input-box">
                                <input type="checkbox" id="watching" v-model="isWatching">
                                <label for="watching">감상중</label>
                            </div>
                        </div>
                        <div class="body-box">
                            <div class='date-picker-box'>
                                <Datepicker v-model="startDate" inputFormat='yy-MM-dd' />
                            </div>
                            <span> - </span>
                            <div class='date-picker-box'>
                                <span v-if='isWatching'>ING</span>
                                <Datepicker v-else v-model="endDate" inputFormat='yy-MM-dd' />
                            </div>
                        </div>
                    </div>
                    <div class="rating-container">
                        <p>평점</p>
                        <div class="rating-box" ref="ratingBoxRef" @click="handleRatingClick">
                            <div v-for="i in 5" :key="i" class="star-box relative">
                                <PhStar class="star-stroke" :size="24" />
                                <div class="star-fill" :style="{ width: getStarFill(i) }">
                                    <PhStar class="star-filled" weight="fill" :size="24" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="review-write-container">
                    <div class="input-box">
                        <textarea v-model="comment" name="review-write" id="review-write"
                            placeholder="자유롭게 감상을 남겨주세요."></textarea>
                    </div>
                </div>
                <div class="btn-box">
                    <button type="submit" id='post-review-btn' class='active-btn text-btn'>
                        {{ isEditMode ? '수정하기' : '등록하기' }}
                    </button>
                </div>
            </form>
        </div>
        <div class="modal-bg manual-tags-modal" v-if="isTagModalOpen">
            <div class="modal-container">
                <div class="header">
                    <p class="title">작품을 평가해주세요.</p>
                </div>
                <div class="body">
                    <p>{{ modalDescription }} (중복 선택 가능)</p>
                    <div class="tags-container">
                        <div class="input-box" v-for="tag in manualTags" :key="tag.id">
                            <input type="checkbox" :id="tag.id" :value="tag.id" v-model="selectedCategories">
                            <label :for="tag.id">{{ tag.label }}</label>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="btn-box">
                        <button class="close neutral-btn" @click="isTagModalOpen = false">돌아가기</button>
                        <button class="active-btn post-manual-tags" @click="submitWithManualTags">
                            저장하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.review-write-section {
    padding-top: var(--header-height);
}

.review-write-section .work-info-container {
    width: 100%;
    aspect-ratio: 3/2;
    overflow: hidden;
}

.review-write-section .work-info-container .img-box {
    margin-top: -15%;
}

.review-write-section .input-container {
    display: flex;
    margin-top: -10%;
    gap: 8px;
}

.review-write-section .input-container>div {
    width: calc(50% - 4px);
    padding: 8px;
    border-radius: 8px;
    background-color: var(--bg-elevated);
    box-shadow: var(--box-default);
    text-align: center;
}

.review-write-section .input-container p {
    font-weight: 500;
}

.review-write-section .date-input-box .head-box .input-box {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    color: var(--text-sub);
}

.review-write-section .date-input-box .head-box p {
    margin: 0 51px;
}

.review-write-section .date-input-box .body-box {
    margin-top: 6px;
    display: flex;
    gap: 4px;
}

.review-write-section .date-input-box .date-picker-box {
    width: calc(50% - 5.5px);
    font-size: var(--font-size-sub);
}

.review-write-section .date-picker-box span {
    display: flex;
    align-items: center;
    justify-content: center;
}

.review-write-section .date-picker-box input {
    width: 100%;
    text-align: center;
}

.review-write-section .rating-container .rating-box {
    margin-top: 6px;
    display: inline-block;
}

.review-write-section .rating-box .star-box {
    display: inline-block;
    margin: 0 2px;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

.review-write-section .rating-box .star-stroke,
.review-write-section .rating-box .star-fill>svg {
    display: block;
    width: 24px;
    height: 24px;
    color: var(--chip-important-bg);
}

.review-write-section .rating-box .star-fill {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
}

.review-write-section .review-write-container {
    margin-top: 2rem;
}

.review-write-section .review-write-container textarea {
    width: 100%;
    min-height: 250px;
    resize: vertical;
    margin-top: 1rem;
    padding: 6px;
    outline: none;
    white-space: pre-wrap;
}

.review-write-section .btn-box {
    margin-top: 3rem;
    text-align: right;
}

.manual-tags-modal .body p {
    margin-bottom: 20px;
}

.manual-tags-modal .tags-container .input-box {
    display: inline;
}

.manual-tags-modal .tags-container .input-box input {
    display: none;
}

.manual-tags-modal .tags-container .input-box input[type="checkbox"]:checked+label {
    background-color: var(--chip-important-bg);
    color: var(--text-inverse)
}

.manual-tags-modal .tags-container .input-box label {
    background-color: var(--chip-default-bg);
    white-space: nowrap;
    padding: 2px 12px;
    border-radius: 16px;
    margin: 0 4px 4px 0;
    transition: ease 0.2s;
    cursor: pointer;
}

@media screen and (min-width: 520px) {
    .review-write-section .date-input-box .head-box .input-box {
        gap: 4px;
    }
}

@media screen and (min-width: 600px) {
    .review-write-section .work-info-container {
        aspect-ratio: 9 / 5;
    }

    .review-write-section .input-container {
        margin-top: -6%;
    }
}

@media screen and (min-width: 640px) {
    .review-write-section .work-info-container {
        aspect-ratio: 11 / 5;
    }
}
</style>