<script lang="ts" setup>
import { ref } from "vue";
import { createInquiry } from "../../api/inquiry";
import { useToast } from "../../composables/useToast";

const { showToast } = useToast();

const replyEmail = ref("");
const subject = ref("");
const content = ref("");
const isSubmitting = ref(false);

const submitInquiry = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    await createInquiry({
      replyEmail: replyEmail.value,
      subject: subject.value,
      content: content.value,
    });
    replyEmail.value = "";
    subject.value = "";
    content.value = "";
    showToast("문의가 접수되었습니다.");
  } catch {
    showToast("문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main class="inquiry-board">
    <div class="wrap">
      <section class="notice" aria-label="문의 안내">
        <p>문의 내용을 남겨주시면,</p>
        <p>순차적으로 확인한 후, 이메일로 답변을 발송해드리겠습니다.</p>
      </section>
      <section class="inquiry" aria-label="문의 작성">
        <form @submit.prevent="submitInquiry">
          <div class="input-box">
            <label for="inquiry-email">답변 받을 이메일</label>
            <input
              id="inquiry-email"
              v-model="replyEmail"
              name="replyEmail"
              type="email"
              autocomplete="email"
              class="input-text"
              required
            />
          </div>
          <div class="input-box">
            <label for="inquiry-subject">제목</label>
            <input
              id="inquiry-subject"
              v-model="subject"
              name="subject"
              type="text"
              class="input-text"
              required
            />
          </div>
          <div class="input-box textarea">
            <label for="inquiry-content">내용</label>
            <textarea
              id="inquiry-content"
              v-model="content"
              name="content"
              required
            ></textarea>
          </div>
          <div class="btn-box">
            <button class="active-btn" type="submit" :disabled="isSubmitting">
              문의하기
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<style>
.inquiry-board {
  .notice {
    text-align: center;
    margin-bottom: 60px;
  }
  .inquiry {
    form {
      .input-box {
        margin-bottom: 8px;
        display: flex;
        gap: 20px;

        label {
          width: 120px;
        }

        input,
        textarea {
          width: calc(100% - 140px);
        }

        &.textarea {
          display: flex;
          align-items: flex-start;

          textarea {
            height: 200px;
          }
        }
      }

      .btn-box {
        margin-top: 20px;
        text-align: right;
      }
    }
  }
}
</style>
