<script setup lang="ts">
import { userProfile, type UserProfileType } from '@/services/users';
import RouterLinkButton from '@@/utils/RouterLinkButton.vue';
import { ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import UserProfileCard from './UserProfileCard.vue';

const route = useRoute();
const props = defineProps({
    handle: String,
    loading: {
        type: Boolean,
        default: false,
    }
})

const user: Ref<UserProfileType|{[key:string]:any}> = ref({});

async function init() {
    user.value = await userProfile(route.params.handle as string);
}

if (!props.loading) {
    await init();
    watch(() => route.fullPath, async () => {
        await init();
    })  
}
</script>

<template>
    <div class="user-profile">
        <div class="header">
            <UserProfileCard
                :loading="loading"
                :handle="(handle as string)"
                :display_name="user.display_name"
                inline
            ></UserProfileCard>

            <RouterLinkButton 
                class="settings-button"
                :to="`/users/${handle as string}/settings`"
                variant="info"
            >
                My settings
            </RouterLinkButton>
        </div>
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

                        <UserProfileCard
                            v-if="!loading"
                            v-for="u in user.followers"
                            
                            :handle="u.handle"
                            :display_name="u.display_name"

                            inline compact clickable
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

                        <UserProfileCard
                            v-if="!loading"
                            v-for="u in user.following"
                            
                            :handle="u.handle"
                            :display_name="u.display_name"

                            inline compact clickable
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

    .header
        display: flex
        justify-content: space-between
        align-items: baseline

        .settings-button
            margin-right: 1em
    
    .relations
        .grid
            display: grid
            grid-template: auto / repeat(3, auto)
</style>