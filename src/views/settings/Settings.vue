<script setup lang="ts">
import { logout } from "../../api/auth"
import router from "../../router";


const handleLogout = async () => {
    try {
        await logout()
    } finally {
        router.replace("/")
    }
}
</script>

<template>
    <section class="settings-list-section">
        <div class="wrap">
            <p>notice</p>
            <p>service center > faq + form</p>
            <p>terms</p>
            <p>service terms</p>
            <p>privacy policy</p>
            <div class="btn-box">
                <button id='logout-btn' @click='handleLogout'>logout</button>
            </div>
            <p>delete account</p>
        </div>
    </section>
</template>

<style></style>