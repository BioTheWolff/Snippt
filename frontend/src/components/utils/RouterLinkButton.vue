<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    to: {
        type: String,
    },
    variant: {
        type: String,
        optional: true
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    inverted: {
        type: Boolean,
        default: false
    }
})

function goto() {
    router.push(props.to as string);
}
</script>

<template>
    <o-button 
        :variant="variant"
        :disabled="disabled"
        :rounded="rounded"
        :inverted="inverted"
        @click="goto()"
    >
        <slot />
    </o-button>
</template>