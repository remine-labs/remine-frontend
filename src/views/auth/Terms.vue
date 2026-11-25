<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Loader from "../../components/Loader.vue";
import { agreeToTerms, getMyTerms } from "../../api/terms";
import type { TermsItem } from "../../api/terms";

const router = useRouter();
const terms = ref<TermsItem[]>([]);
const isLoadingTerms = ref(true);
const isSubmitting = ref(false);
const loadError = ref("");
const submitError = ref("");

const requiredTermsAreAgreed = computed(() =>
  terms.value.every((term) => !term.required || term.agreed),
);
const termsForDisplay = computed(() =>
  [...terms.value].sort((a, b) => {
    if (a.termsType === b.termsType) return 0;
    if (a.termsType === "SERVICE") return -1;
    if (b.termsType === "SERVICE") return 1;
    return 0;
  }),
);

const getTermsTitle = (termsType: string): string => {
  if (termsType === "SERVICE") return "서비스 이용약관";
  if (termsType === "PRIVACY") return "개인정보처리방침";
  return termsType;
};

const submitAgreements = async () => {
  if (
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
      submitError.value =
        "약관 동의 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
      return;
    }

    await router.replace("/");
  } catch {
    submitError.value =
      "약관 동의 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    terms.value = await getMyTerms();
  } catch {
    loadError.value = "약관 정보를 불러오지 못했습니다. 페이지를 새로고침해주세요.";
  } finally {
    isLoadingTerms.value = false;
  }
});
</script>

<template>
  <main class="signup-terms">
    <div class="wrap">
      <h1>약관 동의</h1>
      <p class="description">약관 내용을 확인하고 동의해 주세요.</p>

      <Loader v-if="isLoadingTerms">약관 정보를 불러오는 중입니다.</Loader>
      <p v-else-if="loadError" class="error-message" role="alert">
        {{ loadError }}
      </p>
      <template v-else>
        <div class="agreements-step">
          <h2>약관 동의</h2>
          <ul class="terms-list">
            <li
              v-for="term in termsForDisplay"
              :key="`${term.termsType}-${term.version}`"
            >
              <div class="input-box checkbox">
                <label :for="`term-${term.termsType}-${term.version}`">
                  <input
                    :id="`term-${term.termsType}-${term.version}`"
                    v-model="term.agreed"
                    type="checkbox"
                  />
                  <span class="term-title">
                    {{ getTermsTitle(term.termsType) }}
                    <strong v-if="term.required">필수</strong>
                    <span v-else>선택</span>
                  </span>
                </label>
                <RouterLink
                  v-if="term.termsType === 'SERVICE'"
                  to="/terms/service"
                  target="_blank"
                >
                  내용 보기
                </RouterLink>
                <RouterLink
                  v-else-if="term.termsType === 'PRIVACY'"
                  to="/terms/privacy"
                  target="_blank"
                >
                  내용 보기
                </RouterLink>
              </div>
            </li>
          </ul>
          <p v-if="submitError" class="error-message" role="alert">
            {{ submitError }}
          </p>
          <div class="btn-box">
            <button
              type="button"
              class="active-btn"
              :disabled="
                !requiredTermsAreAgreed ||
                isSubmitting ||
                terms.length === 0
              "
              @click="submitAgreements"
            >
              {{ isSubmitting ? "처리 중..." : "동의하고 시작하기" }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<style>
.signup-terms {
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
              color: var(--error);
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
