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
    // TODO: 백엔드에게 Liked 값 받으면 추후 작업
    // liked?: boolean;
}

const props = defineProps<WorkCardProps>();

const goToWorkDetail = () => {
    router.push(`/work/${props.mediaType}/${props.workId}`)
}
</script>

<template>
    <div class="work-box relative" @click='goToWorkDetail'>
        <div class="type-box">
            <span class="media-type sub-text chip" :class="mediaType">
                {{ mediaType?.toUpperCase() }}
            </span>
        </div>

        <div class="img-box poster">
            <img :src="`https://image.tmdb.org/t/p/w200${workPosterPath}`" :alt="workTitle" />
        </div>

        <div class="work-info-box">
            <div class="work-title-box">
                <span class="work-name ellipsis-1">
                    {{ workTitle }}
                </span>
                <span class="release-year number">
                    ({{ workReleaseDate?.slice(0, 4) }})
                </span>
            </div>

            <div class="icon-box watchlist">
                <button class="heart">
                    <PhHeart :size="20" />
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.work-box {
    width: calc(50% - 4px);
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--bg-elevated);
    cursor: pointer;
    box-shadow: 0px 0px 8px #00000014
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
    width: calc(100% - 27px);
    gap: 4px;
}

.work-box .work-title-box .work-name {
    max-width: calc(100% - 4rem);
}

.work-box .work-title-box .release-year {
    flex-shrink: 0;
}
</style>