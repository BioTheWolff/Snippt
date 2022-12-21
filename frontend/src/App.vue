<script setup lang="ts">
import { RouterView } from 'vue-router';
import RouterLinkButton from '@@/utils/RouterLinkButton.vue';
import UserHeaderCard from '@@/users/UserHeaderCard.vue';
</script>

<template>
    <header id="site-header">
        <div class="brand">
            Snippt
        </div>
        <div class="nav">
            <RouterLinkButton variant="info" to="/register">Sign up</RouterLinkButton>
            <RouterLinkButton variant="primary" to="/login">Login</RouterLinkButton>

            <UserHeaderCard handle="CHANGEME"></UserHeaderCard>
            <RouterLinkButton variant="primary" to="/logout">Logout</RouterLinkButton>
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
