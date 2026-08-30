<script setup lang="ts"></script>

<template>
    <section class="article-item-section">
        <div class="wrap">
            <div class="title"></div>
            <div class="meta-box">
                <span class="date">yy.mm.dd</span>
            </div>
            <div class="main-text-box"></div>
            <div class="btn-box">
                <button class="neutral-btn">목록</button>
            </div>
        </div>
    </section>

</template>

<style scoped>
.title {
    margin-top: 40px;
}

.meta-box {
    margin-top: 10px;
    text-align: right;
}

.main-text-box {
    border-top: solid 1px var(--text-menu);
    border-bottom: solid 1px var(--text-menu);
    margin-top: 20px;
    word-break: keep-all;
    white-space: pre-wrap;
}


.btn-box {
    margin-top: 20px;
    display: flex;
    justify-content: right;
}
</style>