<script setup lang="ts">
defineProps({
    handle: String
})
</script>

<template>
    <div class="user-header-card">
        <o-icon pack="fas" icon="user" size="large" variant="info"> </o-icon>
        <span class="handle">@{{ handle }}</span>
    </div>
</template>

<style scoped lang="sass">
.user-header-card
    display: flex
    align-items: center

    height: 4rem
    line-height: 4rem

    padding: 0 20px 0 12px
    border-radius: 30px

    background-color: $background

    .handle
        font-weight: bold
</style>