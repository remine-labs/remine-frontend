<script setup lang="ts">
import { PhCaretRight } from "@phosphor-icons/vue";
import { logout } from "../../api/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = async () => {
  try {
    await logout();
  } finally {
    router.replace("/");
  }
};

// const goToNotice = () => {}
// const goToServiceCenter = () => {}

const goToServiceTerms = () => {
  router.push("/terms/service");
};

const goToPrivacyPolicy = () => {
  router.push("/terms/privacy");
};

const goToInquiry = () => {
  router.push("/inquiry");
};
</script>

<template>
  <main class="settings-list">
    <div class="wrap">
      <div class="group information-container">
        <p class="group-name">INFORMATION</p>
        <div class="menu-box">
          <div class="menu">
            <p>공지사항</p>
            <PhCaretRight :size="24" />
          </div>
          <!-- TODO: 임의 goToInquiry 처리.
           추후에는 CustomerService.vue 추가하여 해당 페이지로 이동.
           FAQ를 구성하고 하단에 별도로 '문의하기' 버튼을 통하여 inquiry로 진입 -->
          <div class="menu" @click="goToInquiry">
            <p>고객센터</p>
            <PhCaretRight :size="24" />
          </div>
        </div>
      </div>
      <div class="group terms-container">
        <p class="group-name">TEMRS</p>
        <div class="menu-box">
          <div class="menu" @click="goToServiceTerms">
            <p>서비스 약관</p>
            <PhCaretRight :size="24" />
          </div>
          <div class="menu" @click="goToPrivacyPolicy">
            <p>개인정보처리방침</p>
            <PhCaretRight :size="24" />
          </div>
        </div>
      </div>
      <div class="group account-container">
        <p class="group-name">ACCOUNT</p>
        <div class="menu-box">
          <div class="menu" @click="handleLogout">
            <p id="logout-btn">로그아웃</p>
          </div>
          <div class="menu">
            <p>계정삭제</p>
          </div>
        </div>
      </div>
      <!-- TODO: 추후 디자인 및 문장 수정 예정 -->
      <div class="source-attribution-container">
        <p class="group-name">정보</p>
        <div class="menu-box">
          <div class="menu">
            <p>TMDB</p>
          </div>
          <div class="menu">
            <p>Just Watch</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.settings-list .group {
  margin-top: 20px;
}

.settings-list .group-name {
  text-indent: 10px;
  font-weight: bold;
  color: var(--text-menu);
  font-size: var(--font-size-sub);
  line-height: 3;
}

.settings-list .menu-box {
  background-color: var(--bg-elevated);
  border-radius: 16px;
  padding: 10px 16px;
  box-shadow: var(--box-default);
}

.settings-list .menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  cursor: pointer;
  margin-bottom: 4px;
}

.settings-list .menu:last-child {
  margin-bottom: 0;
}

.settings-list .menu svg {
  color: var(--text-menu);
}
</style>
