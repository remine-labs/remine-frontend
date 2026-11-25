<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { deleteAccount, getMe, type MeResponse } from "../../api/auth";
import { useToast } from "../../composables/useToast";

const confirmationText = "위 사항을 확인하고 동의하였습니다.";
const user = ref<MeResponse | null>(null);
const typedConfirmation = ref("");
const loadError = ref("");
const isDeleting = ref(false);
const router = useRouter();
const { showToast } = useToast();

const cancelAccountDeletion = () => {
  router.push("/settings");
};

const submitAccountDeletion = async () => {
  if (typedConfirmation.value !== confirmationText || isDeleting.value) {
    return;
  }

  if (!window.confirm("탈퇴를 진행할까요?")) {
    return;
  }

  isDeleting.value = true;

  try {
    await deleteAccount();
    showToast("계정이 탈퇴되었습니다.");
    await router.replace("/");
  } catch (error) {
    console.error("계정 탈퇴 실패", error);
    showToast("계정 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.", "error");
  } finally {
    isDeleting.value = false;
  }
};

onMounted(async () => {
  try {
    user.value = await getMe();
  } catch (error) {
    console.error("계정 정보 조회 실패", error);
    loadError.value = "계정 정보를 불러오지 못했습니다.";
  }
});
</script>

<template>
  <main class="account-deletion">
    <div class="wrap">
      <section class="notice">
        <h1>계정 탈퇴</h1>
        <h2>탈퇴할 계정 정보</h2>
        <p v-if="user">로그인 수단: {{ user.provider }}</p>
        <p v-if="user">이메일: {{ user.email }}</p>
        <p v-else-if="loadError" role="alert">{{ loadError }}</p>
        <p v-else>계정 정보를 불러오는 중입니다.</p>

        <h2>탈퇴 전 확인해 주세요</h2>
        <p>탈퇴 후에도 같은 계정으로 다시 가입할 수 있습니다.</p>
        <p>단, 탈퇴 시 삭제된 데이터는 복구할 수 없습니다.</p>
        <p>탈퇴 시 다음 데이터가 삭제됩니다.</p>
        <ul>
          <li>작성한 리뷰</li>
          <li>관심 작품</li>
          <li>추천 작품</li>
          <li>YouTube 재생 목록 연동 내역</li>
        </ul>
      </section>
      <section class="confirm">
        <h2>탈퇴 확인</h2>
        <label for="deletion-confirmation">
          위 내용을 확인하고 동의하시면 아래 문구를 입력해 주세요.
        </label>
        <p>{{ confirmationText }}</p>
        <div class="input-text">
          <input
            id="deletion-confirmation"
            v-model="typedConfirmation"
            type="text"
            autocomplete="off"
            :placeholder="confirmationText"
          />
        </div>
        <div class="btn-box">
          <button
            class="neutral-btn"
            type="button"
            @click="cancelAccountDeletion"
          >
            취소
          </button>
          <button
            class="active-btn"
            type="button"
            :disabled="
              typedConfirmation !== confirmationText || isDeleting
            "
            @click="submitAccountDeletion"
          >
            {{ isDeleting ? "탈퇴 처리 중..." : "탈퇴하기" }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style>
.input-text {
  input {
    width: 100%;
  }
}
</style>
