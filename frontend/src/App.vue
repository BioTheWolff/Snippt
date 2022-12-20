<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <header id="site-header">
        <div class="brand">Snippt</div>
        <div>test</div>
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
</style>
