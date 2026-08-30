<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PhQuestion, PhWarningCircle } from '@phosphor-icons/vue'

interface Props {
    type?: 'info' | 'warning'
    text: string[]
    position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    position: 'top',
})

const isOpen = ref(false)

const toggleTooltip = () => {
    isOpen.value = !isOpen.value
}

const closeTooltip = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (!target.closest('.tooltip')) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', closeTooltip)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', closeTooltip)
})
</script>

<template>
    <div class="tooltip relative">
        <button type="button" class="tooltip-trigger" :class="`tooltip-${props.type}`" @click.stop="toggleTooltip">
            <PhQuestion v-if="props.type === 'info'" />
            <PhWarningCircle v-else />
        </button>

        <div v-if="isOpen" class="tooltip-content description" :class="`tooltip-${props.position}`">
            <p v-for="(line, index) in props.text" :key="index">
                {{ line }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.tooltip {
    display: flex;
}

.tooltip .tooltip-trigger svg {
    width: 20px;
    height: 20px;
    color: var(--text-sub);
}

.tooltip .tooltip-content {
    position: absolute;
    bottom: 2.6rem;
    left: -10px;
    width: calc(100vw - 140px);
    background-color: var(--bg-elevated);
    padding: 8px;
    border-radius: 8px;
    box-shadow: var(--box-default);
    word-break: keep-all;
}
</style>
