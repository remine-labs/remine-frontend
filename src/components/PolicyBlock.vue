<script setup lang="ts">
import PolicyBlock from "./PolicyBlock.vue";

defineProps<{
    blocks: any;
}>();
</script>

<template>
    <div class="blocks" :class="blocks.type ?? 'text'">

        <!-- table -->
        <div v-if="blocks.type === 'table'" class="table">
            <table>
                <thead>
                    <tr>
                        <th v-for="(header, headerIndex) in blocks.data.header" :key="headerIndex">
                            {{ header }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, rowIndex) in blocks.data.rows" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                            {{ cell }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- paragraph -->
        <template v-else-if="blocks.type === 'paragraph'">
            <ol v-if="blocks.ordered">
                <li v-for="(item, index) in blocks.content" :key="index">
                    <template v-if="typeof item === 'string'">
                        {{ item }}
                    </template>

                    <template v-else>
                        <p class="title">{{ item.title }}</p>

                        <div class="content-box">
                            <template v-for="(content, contentIndex) in item.content" :key="contentIndex">
                                <p v-if="typeof content === 'string'">
                                    {{ content }}
                                </p>

                                <PolicyBlock v-else :blocks="content" />
                            </template>
                        </div>
                    </template>
                </li>
            </ol>

            <ul v-else>
                <li v-for="(item, index) in blocks.content" :key="index">
                    <template v-if="typeof item === 'string'">
                        {{ item }}
                    </template>

                    <template v-else>
                        <p class="title">{{ item.title }}</p>

                        <div class="content-box">
                            <template v-for="(content, contentIndex) in item.content" :key="contentIndex">
                                <p v-if="typeof content === 'string'">
                                    {{ content }}
                                </p>

                                <PolicyBlock v-else :blocks="content" />
                            </template>
                        </div>
                    </template>
                </li>
            </ul>
        </template>

        <!-- text -->
        <template v-else>
            <template v-for="(item, index) in blocks.content" :key="index">
                <p v-if="!item.type">
                    {{ item.title }}
                </p>
                <PolicyBlock v-else :blocks="item" />
            </template>
        </template>

    </div>
</template>


<style scoped>
.terms-section .title {
    font-family: var(--font-family-body);
    font-size: var(--font-size-body)
}

.terms-section ol,
.terms-section ul {
    margin-left: 0;
    padding-left: 2.4rem;
}

.terms-section ol {
    list-style: auto;
}

.terms-section ol ol {
    list-style: hangul;
}

.terms-section ul {
    list-style: disc;
}

.terms-section table {
    width: 100%;
    border: 1px solid var(--text-sub);
    border-collapse: collapse;
    text-align: center;
    word-break: keep-all
}

.terms-section th,
.terms-section td {
    border: 1px solid var(--text-sub);
}
</style>