<script setup lang="ts">
import RouterLinkButton from './RouterLinkButton.vue';
import UserHeaderCard from '@@/users/UserHeaderCard.vue';
import { SiteLogo as logo } from "@/assets/img";

import { useRoute, useRouter } from 'vue-router';
import { authStatus, logout as apiLogout } from '@/services/auth';
import { useUserStore } from '@/stores/user';
import { onMounted, ref, watch } from 'vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isNavOpened = ref(false);

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

watch(() => route.fullPath, () => {
    isNavOpened.value = false;
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
        <div :class="`nav ${isNavOpened ? 'mobile-opened': ''}`">
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

            <o-dropdown aria-role="list" v-if="userStore.is_logged_in && userStore.is_admin">
                <template #trigger="{ active }">
                    <o-button variant="warning">
                    <span>Admin panel</span>
                    <o-icon :icon="active ? 'caret-up' : 'caret-down'"></o-icon>
                    </o-button>
                </template>

                <o-dropdown-item 
                    aria-role="listitem" 
                    @click="$router.push('/admin/users')"
                >Users</o-dropdown-item>
            </o-dropdown>
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
            <o-button 
                variant="primary" 
                icon-right="bars"
                v-if="!isNavOpened"
                @click="isNavOpened = true"
            />
            <o-button 
                variant="primary" 
                icon-right="xmark" 
                v-if="isNavOpened"
                @click="isNavOpened = false"
            />
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

        &.mobile-opened
            position: fixed
            top: $header-height
            left: 0

            width: 100vw
            height: 100vh - $header-height
            z-index: 9999

            background: $accent-bg
            border-top: 3px solid $primary

            display: flex
            flex-direction: column
            justify-content: center
            align-items: center

    .nav-mobile-trigger
        display: none
        @include for-up-to-tablet
            display: flex
            align-items: center
</style>