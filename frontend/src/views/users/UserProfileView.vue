<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const handle = route.params.handle;
</script>

<template>
    {{ handle }}
</template>