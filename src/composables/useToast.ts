import { ref } from "vue";

const message = ref("");
const type = ref<"success" | "error">("success");
const isVisible = ref(false);

let timer: ReturnType<typeof setTimeout> | null = null;

const showToast = (
  newMessage: string,
  newType: "success" | "error" = "success",
) => {
  message.value = newMessage;
  type.value = newType;
  isVisible.value = true;

  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    isVisible.value = false;
  }, 3000);
};

const hideToast = () => {
  isVisible.value = false;

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

export function useToast() {
  return {
    message,
    type,
    isVisible,
    showToast,
    hideToast,
  };
}
