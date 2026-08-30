<script setup lang="ts">
import { PhCheckCircle, PhXCircle, PhX } from "@phosphor-icons/vue";
import { useToast } from "../composables/useToast";

const { message, type, isVisible, hideToast } = useToast();
</script>

<template>
    <Transition name="toast">
        <div v-if="isVisible" class="toast" :class="`toast-${type}`">
            <PhCheckCircle v-if="type === 'success'" />
            <PhXCircle v-else />

            <span>{{ message }}</span>

            <button type="button" class="toast-close" @click="hideToast">
                <PhX />
            </button>
        </div>
    </Transition>
</template>