<script setup lang="ts"></script>

<template>
  <div class="spinner">
    <div class="dots-loader">
      <span class="first"></span>
      <span class="second"></span>
      <span class="third"></span>
    </div>
    <div class="loader-text">
      <slot />
    </div>
  </div>
</template>

<style>
.spinner {
  width: 100%;
  min-height: calc(100vh - var(--header-height) - var(--menu-height));
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;

  .dots-loader {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }

  span {
    width: 10px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    animation: bounce 1s infinite ease-in-out;
  }

  .first {
    background: var(--chip-warning-bg);
  }

  .second {
    background: var(--chip-default-bg);
    animation-delay: 0.2s;
  }

  .third {
    background: var(--chip-important-bg);
    animation-delay: 0.4s;
  }
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
