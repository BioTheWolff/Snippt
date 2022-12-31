<script setup lang="ts">
import RouterLinkButton from './RouterLinkButton.vue';
import UserHeaderCard from '@@/users/UserHeaderCard.vue';
import { SiteLogo as logo } from "@/assets/img";

import { useRouter } from 'vue-router';
import { authStatus, logout as apiLogout } from '@/services/auth';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const router = useRouter();
const userStore = useUserStore();

async function logout() {
    await apiLogout();
    router.push('/');
}

async function checkLogin() {
    if (userStore.is_logged_in && !(await authStatus())) {
        logout();
    }
    setTimeout(checkLogin, 1000*60);
}

onMounted(async () => {
    checkLogin();
})
</script>

<template>
    <header id="site-header">
        <div class="brand" @click="$router.push('/')">
            <div class="logo">
                <img :src="logo">
            </div>
            <div>Snippt</div>
        </div>
        <div class="nav">
            <RouterLinkButton 
                v-if="!userStore.is_logged_in" 
                variant="info" 
                to="/register"
            >Sign up</RouterLinkButton>
            <RouterLinkButton 
                v-if="!userStore.is_logged_in" 
                variant="primary" 
                to="/login"
            >Login</RouterLinkButton>

            <RouterLinkButton
                v-if="userStore.is_logged_in"
                variant="info"
                to="/posts/new"
            >Create post</RouterLinkButton>
            <UserHeaderCard
                v-if="userStore.is_logged_in"
                :handle="userStore.handle"
                clickable
            ></UserHeaderCard>
            <o-button
                @click="logout()"
                v-if="userStore.is_logged_in"
                variant="primary"
            >Log out</o-button>
        </div>
        <div class="nav-mobile-trigger">
            <o-button variant="primary" icon-right="bars" />
            <o-button variant="primary" icon-right="xmark" />
        </div>
    </header>
</template>

<style scoped lang="sass">
#site-header
    display: flex
    justify-content: space-between

    height: $header-height
    line-height: $header-height

    padding: 0 $header-horizontal-padding
    margin-bottom: $header-margin-bottom

    background: $accent-bg

    .brand
        font-size: 1.5rem
        cursor: pointer
        
        display: flex
        align-items: center
        gap: 15px

        .logo
            height: $header-height * 0.8
            width: $header-height * 0.8

    .nav
        display: flex
        align-items: center
        gap: 1em

        @include for-up-to-tablet
            display: none

    .nav-mobile-trigger
        display: none
        @include for-up-to-tablet
            display: flex
            align-items: center
</style>