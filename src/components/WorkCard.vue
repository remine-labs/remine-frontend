<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { PhHeart } from '@phosphor-icons/vue'

const router = useRouter();

interface WorkCardProps {
    workId: number;
    workPosterPath: string;
    workTitle: string;
    workReleaseDate?: string;
    mediaType?: string;
    isWatchlisted?: boolean;
}

const props = defineProps<WorkCardProps>();

const emit = defineEmits<{
    (e: "toggle-watchlist"): void;
}>();

const goToWorkDetail = () => {
    router.push(`/work/${props.mediaType}/${props.workId}`)
}
</script>

<template>
    <div class="work-box relative">
        <div class="type-box">
            <span class="media-type description chip" :class="mediaType">
                {{ mediaType?.toUpperCase() }}
            </span>
        </div>

        <div class="img-box poster" @click='goToWorkDetail'>
            <img :src="`https://image.tmdb.org/t/p/w200${workPosterPath}`" :alt="workTitle" />
        </div>

        <div class="work-info-box relative">
            <div class="work-title-box" @click='goToWorkDetail'>
                <span class="work-name ellipsis-1">
                    {{ workTitle }}
                </span>
                <span class="release-year number">
                    ({{ workReleaseDate?.slice(0, 4) }})
                </span>
            </div>

            <div class="icon-box watchlist">
                <button class="heart" @click="emit('toggle-watchlist')">
                    <PhHeart :weight="props.isWatchlisted ? 'fill' : 'regular'" :size="24" />
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.works-list-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

.work-box {
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--bg-elevated);
    cursor: pointer;
    box-shadow: var(--box-default);
}

.work-box .type-box {
    position: absolute;
    top: 5px;
    left: 5px;
}

.work-box .type-box .movie {
    background-color: var(--chip-important-bg);
    color: #f6f4f0;
}

.work-box .type-box .tv {
    background-color: var(--btn-active-bg);
    color: #f6f4f0;
}

.work-box .img-box {
    aspect-ratio: 2/3;
}

.work-box .img-box img {
    height: 100%;
    object-fit: cover;
}

.work-box .work-info-box {
    display: flex;
    gap: 3px;
    align-items: center;
    padding: 12px 6px;
}

.work-box .work-title-box {
    display: flex;
    align-items: center;
    margin-right: 34px;
    gap: 4px;
}

.work-box .work-title-box .work-name {
    max-width: calc(100% - 4rem);
}

.work-box .work-title-box .release-year {
    flex-shrink: 0;
}

.work-box .work-info-box .watchlist {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px;
}

@media screen and (min-width: 520px) {
    .works-list-container {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media screen and (min-width: 690px) {
    .works-list-container {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>