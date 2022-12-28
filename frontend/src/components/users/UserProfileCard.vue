<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps({
    handle: {
        type: String,
        required: true,
    },
    display_name: {
        type: String,
        required: true,
    },
    loading: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
})

const router = useRouter();

const pfp_size = props.compact ? '48px' : '96px';
const display_name_size = props.compact ? '1em' : '1.3em';
const handle_size = props.compact ? '0.8em' : '1.1em';

function handleClick() {
    if (props.clickable) {
        router.push({ name: 'profile', params: { handle: props.handle } })
    }
}
</script>

<template>
    <div 
        :class="`user-profile-card ${inline ? 'inline' : ''} ${compact ? 'compact' : ''} ${clickable ? 'clickable' : ''}`"
        @click="handleClick()"
    >
        <div>
            <o-skeleton
                v-if="loading" 
                :width="pfp_size"
                :height="pfp_size"
                circle animated
            ></o-skeleton>
            <div v-else class="picture"><span>{{ display_name[0] }}</span></div>
        </div>
        <div class="public-details">
            <div class="display-name">
                <o-skeleton
                    v-if="loading"
                    :height="display_name_size"
                    width="160px"
                    animated
                ></o-skeleton>
                <span v-else>{{ display_name }}</span>
            </div>
            <div class="handle">
                <o-skeleton
                    v-if="loading"
                    :height="handle_size"
                    width="100px"
                    animated
                ></o-skeleton>
                <span v-else>@{{ handle }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="sass">
.user-profile-card
    display: flex
    align-items: center
    gap: 15px
    margin-bottom: 3em

    &.clickable
        cursor: pointer

    &:not(.inline)
        background: $card-bg

        padding: 15px
        border-radius: 15px

    &.compact
        .picture
            height: 48px
            width: 48px

        .display-name
            font-size: 1em

        .handle
            font-size: 0.9em

    .picture
        display: flex
        justify-content: center
        align-items: center

        height: 96px
        width: 96px

        border-radius: 100%
        background: $accent-bg

        font-size: 2em

    .public-details
        display: flex
        flex-direction: column
        justify-content: center

        .display-name
            font-size: 1.3em

        .handle
            font-size: 1.1em
</style>