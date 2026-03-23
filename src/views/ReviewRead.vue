<script setup lang='ts'>
// read 페이지 열람 용 목업 데이터
const mockReview = {
    id: 1,
    title: '파묘',
    comment: ' 해외 영화 속 인형에 깃든 귀신이나 악마를 볼 때면, 한국의 ‘굿’과 한판 붙여보고 싶다 생각한 적이 있다. 한국의 오컬트는 영의 존재에 제법 직접적으로 맞서 싸운다. 보이지 않는 것을 외면하지 않는 시선, 정면으로 파고드는 방식. 장재현의 오컬트는 거기서 시작된다.',
    startDate: '2026-03-17',
    endDate: '2026-03-17',
    rating: 4
}

</script>

<template>
    <section class="review-read-section">
        <div class="wrap">
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
                        <button type='button' class='open-story-btn'>펼쳐보기</button>
                        <div class="story-text">
                            <p class="story">story</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="review-container">
                <div class="date-box">
                    <h2 class="description">watch date</h2>
                    <div class="start-date-box">
                        {{ mockReview.startDate }}
                    </div>
                    <div class="end-date-box">
                        {{ mockReview.endDate }}
                    </div>
                </div>
                <div class="rating-box">
                    {{ mockReview.rating }}
                </div>
                <div class="review-text-box">
                    {{ mockReview.comment }}
                </div>
            </div>
            <div class="tags-container">
                <h3 class="description">Tags Type</h3>
                <div class="tags-box">
                    <p class="tag">tag</p>
                </div>
            </div>
            <div class="tag-feedback-container">
                <h4 class="description">feedback</h4>
                <div class="btn-box">
                    <button>만족해요</button>
                    <button>아쉬워요</button>
                </div>
            </div>
        </div>
    </section>

</template>