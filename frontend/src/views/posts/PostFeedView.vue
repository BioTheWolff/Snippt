<script setup lang="ts">
import PostFeed from '@@/posts/PostFeed.vue';
import Post from '@@/posts/Post.vue';
</script>

<template>
  <Suspense>
    <PostFeed></PostFeed>

    <template #fallback>
      <Post 
        v-for="_ in 5"
        loading
      ></Post>
    </template>
  </Suspense>
</template>
