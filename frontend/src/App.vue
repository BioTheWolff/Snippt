<script setup lang="ts">
import { RouterView } from 'vue-router';
import RouterLinkButton from '@@/utils/RouterLinkButton.vue';
import UserHeaderCardVue from '@@/users/UserHeaderCard.vue';
</script>

<template>
    <header id="site-header">
        <div class="brand">
            Snippt
        </div>
        <div class="nav">
            <RouterLinkButton variant="info" to="/register">Sign up</RouterLinkButton>
            <RouterLinkButton variant="primary" to="/login">Login</RouterLinkButton>

            <UserHeaderCardVue></UserHeaderCardVue>
            <RouterLinkButton variant="primary" to="/logout">Logout</RouterLinkButton>
        </div>
    </header>

    <RouterView />
</template>

<style scoped lang="sass">
#site-header
    display: flex
    justify-content: space-between

    height: $header-height
    line-height: $header-height

    padding: 0 $header-padding

    background: $accent-bg

    .brand
        font-size: 1.5rem

    .nav
        display: flex
        align-items: center
        gap: 1em
</style>
