<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import placeholderImage from "../assets/images/imageplaceholder.png";

const props = withDefaults(
  defineProps<{
    src?: string | null;
    alt?: string;
    fit?: "cover" | "contain";
  }>(),
  {
    src: "",
    alt: "",
    fit: undefined,
  },
);

const emit = defineEmits<{
  (event: "placeholder-change", isPlaceholder: boolean): void;
}>();

const hasError = ref(false);

const imageSrc = computed(() =>
  !props.src || hasError.value ? placeholderImage : props.src,
);
const isPlaceholder = computed(() => !props.src || hasError.value);

watch(
  () => props.src,
  () => {
    hasError.value = false;
    emit("placeholder-change", !props.src);
  },
);

onMounted(() => {
  emit("placeholder-change", isPlaceholder.value);
});

const handleError = () => {
  if (isPlaceholder.value) return;

  hasError.value = true;
  emit("placeholder-change", true);
};

const imageAlt = computed(() =>
  isPlaceholder.value ? `${props.alt} 대체 이미지`.trim() : props.alt,
);
</script>

<template>
  <img
    :src="imageSrc"
    :alt="imageAlt"
    :class="{ 'is-placeholder': isPlaceholder }"
    :style="{ objectFit: fit ?? (isPlaceholder ? 'contain' : 'cover') }"
    @error="handleError"
  />
</template>

<style scoped>
img {
  height: 100%;
  object-position: center center;
}
</style>
