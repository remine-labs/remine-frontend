<script setup lang="ts">
import { termsOfService } from "../../data/policies/serviceTerms.ts";
import PolicyBlock from "../../components/PolicyBlock.vue";

const terms = termsOfService;
</script>

<template>
    <section class="terms-section">
        <div class="wrap">
            <div class="terms-basic-container">
                <h2>{{ terms.title }}</h2>
                <div class="date-box">
                    <p class="updated-at">개정일: {{ terms.metadata.updatedAt }}</p>
                    <p class="effective-date">시행일: {{ terms.metadata.effectiveDate }}</p>
                    t
                </div>
                <div class="content-box" v-for="(sentence, index) in terms.content" :key='index'>
                    <p>{{ sentence }}</p>
                </div>
            </div>

            <div class="articles-container">
                <article v-for="(article, index) in terms.articles" :key='index'>
                    <h3>제{{ index + 1 }}조 {{ article.title }}</h3>
                    <div class='content-box' v-if='article.content' v-for="(sentence, index) in article.content"
                        :key='index'>
                        <p>{{ sentence }}</p>
                    </div>
                    <PolicyBlock v-if="article.blocks" :blocks="article.blocks" />
                </article>
            </div>
        </div>
    </section>
</template>
