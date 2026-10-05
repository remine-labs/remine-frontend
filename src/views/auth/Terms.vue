<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Datepicker from "vue3-datepicker";
import axios from "axios";
import Loader from "../../components/Loader.vue";
import { getMe } from "../../api/auth";
import {
  agreeToTerms,
  completeSignup,
  getMyTerms,
} from "../../api/terms";
import type { TermsItem } from "../../api/terms";

const router = useRouter();
const birthDate = ref<Date | undefined>(undefined);
const terms = ref<TermsItem[]>([]);
const isLoadingTerms = ref(true);
const isVerifyingBirthDate = ref(false);
const isBirthDateVerified = ref(false);
const isSubmitting = ref(false);
const loadError = ref("");
const submitError = ref("");

const requiredTermsAreAgreed = computed(() =>
  terms.value.every((term) => !term.required || term.agreed)
);
const termsForDisplay = computed(() =>
  terms.value
    .filter((term) => !term.agreed)
    .sort((a, b) => {
      if (a.termsType === b.termsType) return 0;
      if (a.termsType === "SERVICE") return -1;
      if (b.termsType === "SERVICE") return 1;
      return 0;
    })
);

const getTermsTitle = (termsType: string): string => {
  if (termsType === "SERVICE") return "서비스 이용약관";
  if (termsType === "PRIVACY") return "개인정보처리방침";
  return termsType;
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isApiErrorResponse = (
  value: unknown
): value is { status: string; message: string } => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "status" in value &&
    typeof value.status === "string" &&
    "message" in value &&
    typeof value.message === "string"
  );
};

const verifyBirthDate = async () => {
  if (!birthDate.value || isVerifyingBirthDate.value) return;

  isVerifyingBirthDate.value = true;
  submitError.value = "";

  try {
    const response = await completeSignup(formatDate(birthDate.value));
    if (response.status !== 200) {
      alert("현재 해당 서비스는 만 14세 이상만 이용 가능합니다. 양해 바랍니다.");
      await router.replace("/");
      return;
    }

    isBirthDateVerified.value = true;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 400 &&
      isApiErrorResponse(error.response.data)
    ) {
      alert(`${error.response.data.status}\n${error.response.data.message}`);
    } else {
      alert("현재 해당 서비스는 만 14세 이상만 이용 가능합니다. 양해 바랍니다.");
    }
    await router.replace("/");
  } finally {
    isVerifyingBirthDate.value = false;
  }
};

const submitAgreements = async () => {
  if (
    !isBirthDateVerified.value ||
    !requiredTermsAreAgreed.value ||
    isSubmitting.value
  ) {
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";

  try {
    const response = await agreeToTerms({
      agreements: terms.value
        .filter((term) => term.agreed)
        .map(({ termsType, version }) => ({ termsType, version })),
    });

    if (response.status !== 200) {
      submitError.value = "약관 동의 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
      return;
    }

    await router.replace("/");
  } catch {
    submitError.value = "약관 동의 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    const [user, myTerms] = await Promise.all([getMe(), getMyTerms()]);
    terms.value = myTerms;
    isBirthDateVerified.value = user.birthDateSet;
  } catch {
    loadError.value = "가입 정보를 불러오지 못했습니다. 페이지를 새로고침해주세요.";
  } finally {
    isLoadingTerms.value = false;
  }
});
</script>

<template>
  <section class="signup-terms-section">
    <div class="wrap">
      <h1>{{ isBirthDateVerified ? "약관 변경 사항" : "가입 절차" }}</h1>
      <p class="description">
        {{ isBirthDateVerified ? "필수 약관에 변경 사항이 있으니, 확인해 주세요." : "생년월일 확인 후 하단 약관에 동의해 주세요." }}
      </p>

      <Loader v-if="isLoadingTerms">약관 정보를 불러오는 중입니다.</Loader>
      <p v-else-if="loadError" class="error-message" role="alert">
        {{ loadError }}
      </p>
      <template v-else>
        <div v-if="!isBirthDateVerified" class="birth-date-step">
          <h2>생년월일 입력</h2>
          <div class="date-picker-box input-box">
            <Datepicker v-model="birthDate" inputFormat="yyyy-MM-dd" placeholder="생년월일을 선택해 주세요"
              :disabled="isBirthDateVerified" />
          </div>
          <div class="btn-box">
            <button type="button" class="active-btn"
              :disabled="!birthDate || isBirthDateVerified || isVerifyingBirthDate" @click="verifyBirthDate">
              {{ isVerifyingBirthDate ? "확인 중..." : isBirthDateVerified ? "확인 완료" : "생년월일 확인" }}
            </button>
          </div>
        </div>

        <div class="agreements-step" :class="{ enabled: isBirthDateVerified }">
          <h2>약관 동의</h2>
          <p v-if="!isBirthDateVerified" class="step-hint">
            생년월일 확인 후 약관에 동의할 수 있습니다.
          </p>
          <ul class="terms-list">
            <li v-for="term in termsForDisplay" :key="`${term.termsType}-${term.version}`">
              <div class="input-box checkbox">
                <label :for="`term-${term.termsType}-${term.version}`">
                  <input :id="`term-${term.termsType}-${term.version}`" v-model="term.agreed" type="checkbox"
                    :disabled="!isBirthDateVerified" />
                  <span class="term-title">
                    {{ getTermsTitle(term.termsType) }}
                    <strong v-if="term.required">필수</strong>
                    <span v-else>선택</span>
                  </span>
                </label>
                <RouterLink v-if="term.termsType === 'SERVICE'" to="/terms/service" target="_blank">
                  내용 보기
                </RouterLink>
                <RouterLink v-else-if="term.termsType === 'PRIVACY'" to="/terms/privacy" target="_blank">
                  내용 보기
                </RouterLink>
              </div>
            </li>
          </ul>
          <p v-if="submitError" class="error-message" role="alert">
            {{ submitError }}
          </p>
          <div class="btn-box">
            <button type="button" class="active-btn" :disabled="!isBirthDateVerified ||
              !requiredTermsAreAgreed ||
              isSubmitting ||
              terms.length === 0
              " @click="submitAgreements">
              {{ isSubmitting ? "처리 중..." : "동의하고 시작하기" }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style>
.signup-terms-section {

  h1,
  h2 {
    font-family: var(--font-family-logo);
  }

  h1 {
    font-size: 2.4rem;

    +.description {
      margin-bottom: 20px;
    }
  }

  h2 {
    font-size: 2rem;
  }

  .birth-date-step,
  .agreements-step {
    background-color: var(--bg-surface);
    border-radius: 24px;
    padding: 20px;
    margin-bottom: 40px;

    .input-box {
      background-color: var(--bg-elevated);
      padding: 6px;
      border-radius: 8px;
      margin: 12px 0;

      &.checkbox {
        display: flex;
        align-items: center;
        justify-content: space-between;

        label {
          display: flex;
          align-items: center;
          gap: 4px;

          .term-title {

            strong,
            span {
              font-size: 1.4rem;
              margin-left: 12px;
            }

            strong {
              color: var(--error)
            }
          }
        }
      }
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
