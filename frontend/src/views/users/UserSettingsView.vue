<script setup lang="ts">
import UserSettings from '@/components/users/UserSettings.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const handle = route.params.handle as string;
</script>

<template>
    <Suspense>
        <UserSettings :handle="handle"></UserSettings>

        <template #fallback>
            
        </template>
    </Suspense>
</template>