<script setup lang='ts'></script>

<template>
    <section class="review-create-section">
        <div class="work-info-container">
            <div class="img-box">
                poster
            </div>
            <div class="info-text-box">
                <p class="release-date">YY.MM.DD</p>
                <p class="genre">genre</p>
                <div class="actor-box">
                    <span class="actor-name">actor 1</span>
                    <span class="actor-name">actor 2</span>
                </div>
                <div class="story-box toggle">
                    <button class="open-story-btn">
                        펼쳐보기
                    </button>
                    <div class="story-text">
                        <p class="story">story</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="date-input-container">
            <div class="title-box">
                <h2 class="description">watch date</h2>
                <div class="input-box">
                    <input type="checkbox" id='watching'>
                    <label for="watching">감상중</label>
                </div>
            </div>
            <div class="start-date-box">
                <p class="start-date-text">시작일</p>
                <div>date picker</div>
            </div>
            <div class="end-date-box">
                <p class="end-date-text">종료일</p>
                <div>date picker</div>
                <div class="input-box">
                    <input type="checkbox" id='same-start-date'>
                    <label for="same-start-date">시작일과 동일</label>
                </div>
            </div>
        </div>
        <div class="rating-container">
            <h2 class="description">rating</h2>
            <div class="rating-box">
                star/5
            </div>
        </div>
        <div class="review-write-container">
            <h2 class="description">textarea review</h2>
            <div class="input-box">
                <textarea name="review-write" id="review-write" placeholder='감상을 자유롭게 작성해주세요.'></textarea>
            </div>
        </div>
        <div class="btn-box">
            <button id='post-review-btn'>save</button>
        </div>
    </section>
</template>