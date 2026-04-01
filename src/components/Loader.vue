<script setup lang="ts">

</script>

<template>
    <div class="spinner-overlay">
        <div class="dots-loader">
            <span class='first'></span>
            <span class='second'></span>
            <span class='third'></span>
        </div>
        <div class="loader-text">
            <slot />
        </div>
    </div>
</template>

<style>
.spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: var(--bg-overlay);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    z-index: 999;
}

.dots-loader {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
}

.dots-loader span {
    width: 10px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    animation: bounce 1s infinite ease-in-out;
}

.dots-loader .first {
    background: var(--chip-warning-bg);
}

.dots-loader .second {
    background: var(--chip-default-bg);
    animation-delay: 0.2s;
}

.dots-loader .third {
    background: var(--chip-important-bg);
    animation-delay: 0.4s;
}

@keyframes bounce {

    0%,
    80%,
    100% {
        transform: scale(0);
        opacity: 0.3;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>