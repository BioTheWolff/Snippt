<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    handle: {
        type: String,
        required: true,
    },
    clickable: Boolean,
})

function handleClick() {
    if (props.clickable) {
        router.push({ name: 'profile', params: { handle: props.handle } })
    }
}
</script>

<template>
    <div :class="`user-header-card ${clickable ? 'clickable' : ''}`" @click="handleClick()">
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

    &.clickable
        cursor: pointer
</style>