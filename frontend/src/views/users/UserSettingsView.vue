<script setup lang="ts">
import UserSettings from '@/components/users/UserSettings.vue';
import { redirectUnlessLoggedIn } from '@/services/auth';
import { useRoute } from 'vue-router';

const route = useRoute();
const handle = route.params.handle as string;

redirectUnlessLoggedIn();
</script>

<template>
    <Suspense>
        <UserSettings :handle="handle"></UserSettings>

        <template #fallback>
            
        </template>
    </Suspense>
</template>