<script setup lang="ts">
import { PhCaretRight } from "@phosphor-icons/vue";
import { logout } from "../../api/auth"
import { useRouter } from "vue-router";

const router = useRouter()

const handleLogout = async () => {
    try {
        await logout()
    } finally {
        router.replace("/")
    }
}

// const goToNotice = () => {}
// const goToServiceCenter = () => {}

const goToServiceTerms = () => {
    router.push('/terms/service')
}

const goToPrivacyPolicy = () => {
    router.push('/terms/privacy')
}

</script>

<template>
    <section class="settings-list-section">
        <div class="wrap">
            <div class="group information-container">
                <p class="group-name">
                    INFORMATION
                </p>
                <div class="menu-box">
                    <div class="menu">
                        <p>공지사항</p>
                        <PhCaretRight :size="24" />
                    </div>
                    <div class="menu">
                        <p>고객센터 > faq + form</p>
                        <PhCaretRight :size="24" />
                    </div>
                </div>
            </div>
            <div class="group terms-container">
                <p class="group-name">
                    TEMRS
                </p>
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
                    <div class="menu" @click='handleLogout'>
                        <p id='logout-btn'>로그아웃</p>
                    </div>
                    <div class="menu">
                        <p>계정삭제</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.settings-list-section .group {
    margin-top: 20px;
}

.settings-list-section .group-name {
    text-indent: 10px;
    font-weight: bold;
    color: var(--text-menu);
    font-size: var(--font-size-sub);
    line-height: 3;
}

.settings-list-section .menu-box {
    background-color: var(--bg-elevated);
    border-radius: 16px;
    padding: 10px 16px;
    box-shadow: var(--box-default)
}

.settings-list-section .menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    cursor: pointer;
    margin-bottom: 4px;
}

.settings-list-section .menu:last-child {
    margin-bottom: 0;
}

.settings-list-section .menu svg {
    color: var(--text-menu)
}
</style>