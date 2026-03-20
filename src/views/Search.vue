<script setup lang='ts'>
import { PhMagnifyingGlass } from '@phosphor-icons/vue';
</script>

<template>
    <section class="search-section">
        <div class="wrap">
            <div class="search-container">
                <div class="input-box">
                    <input type="text">
                </div>
                <div class="icon-box">
                    <button>
                        <PhMagnifyingGlass :size='24'></PhMagnifyingGlass>
                    </button>
                </div>
            </div>
            <div class="works-list-container">
                <div class="work-box">
                    <div class="img-box poster">poster</div>
                    <p class="work-name">work name</p>
                    <p class="release-date">release date</p>
                    <p class="genre">genre</p>
                    <div class="actor-box">
                        <p class="actor">actor 1</p>
                        <p class="actor">actor 2</p>
                    </div>
                    <div class="story-box">
                        <p class="story">
                            story
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>