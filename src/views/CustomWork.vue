<script setup lang='ts'></script>

<template>
    <section class="add-work-section">
        <div class="wrap">
            <!-- TODO: CustomWork 페이지 작업 / 해당 구조를 reviewCreate/reviewEdit에서 modal로 가지고 와서 patch api연결
     post CustomWork 이후 reviewCreate로 이동  -->
            <!-- TODO: image 값 string인 부분 처리 방법 문의하였음. 답변 온 이후 작업 재개 예정 -->
            <div class="input-box">
                <span>작품명: </span>
                <input type="text" placeholder='작품명을 입력하세요' required>
            </div>
            <div class="input-box">
                <span>종류</span>

                <input type="radio" id="radio-movie" name="mediaType" value="movie" required />
                <label for="radio-movie">영화</label>

                <input type="radio" id="radio-tv" name="mediaType" value="tv" />
                <label for="radio-tv">TV 프로그램</label>
            </div>
            <div class="input-box">
                <span>포스터: </span>
                <input type="file">
            </div>
            <div class="input-box">
                <span>메모:</span>
                <textarea placeholder="등장인물, 줄거리 등 내용을 자유롭게 입력해주세요."></textarea>
            </div>
            <div class="btn-box">
                <button class='neutral-btn'>취소</button>
                <button class='active-btn add-work-btn'>등록</button>
            </div>
        </div>
    </section>
</template>

<style></style>