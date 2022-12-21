<script setup lang="ts">
import UserProfileCard from './UserProfileCard.vue';

const props = defineProps({
    handle: String,
    loading: {
        type: Boolean,
        default: false,
    }
})
</script>

<template>
    <div class="user-profile">
        <UserProfileCard
            :loading="loading"
            :handle="(handle as string)"
            display_name="My Super Display Name"
            inline
        ></UserProfileCard>
        <div class="relations">
            <o-tabs type="toggle">
                <o-tab-item>
                    <template #header>
                        <o-icon 
                            pack="fas"
                            icon="paste"
                            size="large"
                            rootClass="icon-purple"
                        ></o-icon>
                        <span>Posts</span>
                    </template>
                </o-tab-item>
                <o-tab-item>
                    <template #header>
                        <o-icon 
                            pack="fas"
                            icon="users"
                            size="large"
                            rootClass="icon-purple"
                        ></o-icon>
                        <span>Followers</span>
                    </template>

                    <div class="grid">
                        <UserProfileCard
                            v-if="loading"
                            v-for="_ in 11"
                            
                            handle=""
                            display_name=""

                            loading inline compact
                        ></UserProfileCard>
                    </div>
                </o-tab-item>
                <o-tab-item>
                    <template #header>
                        <o-icon 
                            pack="fas"
                            icon="address-book"
                            size="large"
                            rootClass="icon-purple"
                        ></o-icon>
                        <span>Following</span>
                    </template>

                    <div class="grid">
                        <UserProfileCard
                            v-if="loading"
                            v-for="_ in 11"
                            
                            handle=""
                            display_name=""

                            loading inline compact
                        ></UserProfileCard>
                    </div>
                </o-tab-item>
            </o-tabs>
        </div>
    </div>
</template>

<style scoped lang="sass">
.user-profile
    background: $card-bg

    padding: 15px
    border-radius: 15px
    
    .relations
        .grid
            display: grid
            grid-template: auto / repeat(3, auto)
</style>