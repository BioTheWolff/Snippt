<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

import RouterLinkButton from '@@/utils/RouterLinkButton.vue';
import UserHeaderCard from '@@/users/UserHeaderCard.vue';

import { logout as apiLogout } from './services/auth';
import { useUserStore } from './stores/user';


const router = useRouter();
const userStore = useUserStore();

async function logout() {
    await apiLogout();
    router.push('/');
}
</script>

<template>
    <header id="site-header">
        <div class="brand" @click="$router.push('/')">
            Snippt
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
    </header>

    <main>
        <div class="filler"></div>
        <div class="filler right"></div>
        <div id="site-content">
            <RouterView />
        </div> 
    </main>
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

    .nav
        display: flex
        align-items: center
        gap: 1em

main
    display: flex
    min-height: calc(100vh - $header-height-full)

    .filler
        width: 25vw
        &.right
            order: 3
    
    #site-content
        flex-grow: 1
</style>
