<script setup lang="ts">
import Post from '@@/posts/Post.vue';

defineProps({
    loading: Boolean,
    post: {},
})
</script>

<template>
    <div class="feed">
        <Post loading></Post>
    </div>
</template>

<style scoped lang="sass">
.feed
    display: flex
    flex-direction: column
    justify-content: stretch
    align-items: center
    gap: 2em
</style>