import { ref } from "vue";

const headerTitle = ref<string | null>(null);

export const useHeaderTitle = () => ({
  headerTitle,
  setHeaderTitle: (title: string | null) => {
    headerTitle.value = title;
  },
});
