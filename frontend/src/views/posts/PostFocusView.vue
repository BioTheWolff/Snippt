<script setup lang="ts">
import PostFocus from '@@/posts/PostFocus.vue';
</script>

<template>
  <Suspense>
    <PostFocus></PostFocus>

    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
