<script setup lang="ts">
import UserProfile from '@/components/users/UserProfile.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const handle = route.params.handle as string;
</script>

<template>
    <Suspense>
        <UserProfile :handle="handle"></UserProfile>

        <template #fallback>
            <UserProfile :handle="handle" loading></UserProfile>
        </template>
    </Suspense>
</template>