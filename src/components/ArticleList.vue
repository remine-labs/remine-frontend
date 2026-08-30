<script setup lang="ts"></script>

<template>
    <section class="article-list-section">
        <div class="wrap">
            <div class="title">ReMine에서 알려드립니다.</div>
            <div class="meta-box">
                <span class="total-count"> n / total</span>
            </div>
            <div class="list-container">
                <div class="header">
                    <div class="date">게시일</div>
                    <div class="article-title">제목</div>
                </div>
                <div class="body">
                    <article class="article-item">
                        <div class="date">yy.mm.dd</div>
                        <div class="article-title ellipsis-1">article title</div>
                    </article>
                </div>
            </div>
            <div class="pagination-box">
                pagination 위치
            </div>
        </div>
    </section>
</template>

<style scoped>
.title {
    margin-top: 40px;
}

.meta-box {
    text-align: right;
}

.list-container {
    margin-top: 20px;
}

.header,
.body .article-item {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header {
    border-top: 2px solid var(--text-menu);
    border-bottom: 2px solid var(--text-menu);
}

.body {
    border-bottom: 2px solid var(--text-menu);
}

.article-item {
    padding: 6px 0;
    border-bottom: 1px solid var(--text-icon);
}

.article-item:last-child {
    border-bottom: none;
}

.date {
    min-width: 60px;
    flex-shrink: 0;
    text-align: center;
}

.article-title {
    min-width: 0;
    text-align: left;
}
</style>