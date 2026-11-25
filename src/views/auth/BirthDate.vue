<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Datepicker from "vue3-datepicker";
import axios from "axios";
import { completeSignup } from "../../api/terms";

const router = useRouter();
const birthDate = ref<Date | undefined>(undefined);
const isSubmitting = ref(false);
const submitError = ref("");

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isApiErrorResponse = (
  value: unknown,
): value is { status: string; message: string } => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "status" in value &&
    typeof value.status === "string" &&
    "message" in value &&
    typeof value.message === "string"
  );
};

const submitBirthDate = async () => {
  if (!birthDate.value || isSubmitting.value) return;

  isSubmitting.value = true;
  submitError.value = "";

  try {
    const response = await completeSignup(formatDate(birthDate.value));
    if (response.status !== 200) {
      submitError.value = "생년월일을 확인하지 못했습니다. 다시 시도해 주세요.";
      return;
    }

    await router.replace("/terms");
  } catch (error) {
    console.error("생년월일 확인 실패", error);
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 400 &&
      isApiErrorResponse(error.response.data)
    ) {
      submitError.value = `${error.response.data.status}\n${error.response.data.message}`;
    } else {
      submitError.value = "생년월일 확인에 실패했습니다. 다시 시도해 주세요.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main class="signup-birth-date">
    <div class="wrap">
      <h1>생년월일 확인</h1>
      <p class="description">
        서비스 이용을 위해 생년월일을 입력해 주세요.
      </p>

      <section class="birth-date-step">
        <h2>생년월일 입력</h2>
        <div class="date-picker-box input-box">
          <Datepicker
            v-model="birthDate"
            inputFormat="yyyy-MM-dd"
            placeholder="생년월일을 선택해 주세요"
          />
        </div>
        <p v-if="submitError" class="error-message" role="alert">
          {{ submitError }}
        </p>
        <div class="btn-box">
          <button
            type="button"
            class="active-btn"
            :disabled="!birthDate || isSubmitting"
            @click="submitBirthDate"
          >
            {{ isSubmitting ? "확인 중..." : "생년월일 확인" }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style>
.signup-birth-date {
  h1,
  h2 {
    font-family: var(--font-family-logo);
  }

  h1 {
    font-size: 2.4rem;

    + .description {
      margin-bottom: 20px;
    }
  }

  h2 {
    font-size: 2rem;
  }

  .birth-date-step {
    background-color: var(--bg-surface);
    border-radius: 24px;
    padding: 20px;
    margin-bottom: 40px;

    .input-box {
      background-color: var(--bg-elevated);
      padding: 6px;
      border-radius: 8px;
      margin: 12px 0;
    }
  }

  .btn-box {
    display: flex;
    justify-content: flex-end;

    button:disabled {
      background-color: var(--btn-neutral-bg);
      color: var(--text-main);
    }
  }
}
</style>
