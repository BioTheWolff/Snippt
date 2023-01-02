<script setup lang="ts">
import { followUser, unfollowUser, userProfile, type UserProfileType } from '@/services/users';
import { useUserStore } from '@/stores/user';
import RouterLinkButton from '@@/utils/RouterLinkButton.vue';
import { ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import UserProfileCard from './UserProfileCard.vue';
import Post from '@@/posts/Post.vue';

const currentUser = useUserStore();
const route = useRoute();
const props = defineProps({
    handle: String,
    loading: {
        type: Boolean,
        default: false,
    }
})

const user: Ref<UserProfileType|{[key:string]:any}> = ref({});
const follow_text = ref("Follow");

async function init() {
    user.value = await userProfile(route.params.handle as string);
    if (user.value.followers.map((e: any) => e.handle).includes(currentUser.handle)) {
        follow_text.value = "Unfollow";
    } else {
        follow_text.value = "Follow";
    }
}

async function handleFollow() {
    if (follow_text.value === "Unfollow") {
        if (await unfollowUser(route.params.handle as string)) {
            follow_text.value = "Follow";
        }
    } else {
        if (await followUser(route.params.handle as string)) {
            follow_text.value = "Unfollow";
        }
    }
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
                inline reducedmargin
            ></UserProfileCard>

            <RouterLinkButton 
                v-if="currentUser.is_logged_in && $route.params.handle === currentUser.handle"
                class="settings-button"
                :to="`/users/${handle as string}/settings`"
                variant="info"
            >
                My settings
            </RouterLinkButton>

            <o-button
                v-if="currentUser.is_logged_in && $route.params.handle !== currentUser.handle"
                class="settings-button"
                variant="info"
                @click="handleFollow()"
            >
                {{ follow_text }}
            </o-button>
        </div>
        <div class="relations">
            <o-tabs type="toggle">
                <!-- Posts -->
                <o-tab-item>
                    <template #header>
                        <o-icon 
                            pack="fas"
                            icon="paste"
                            size="large"
                            rootClass="icon-purple relations--icon"
                        ></o-icon>
                        <span class="relations--title">Posts</span>
                    </template>

                    <div class="posts">
                        <Post
                            v-if="loading"
                        ></Post>

                        <Post
                            v-if="!loading && user.posts.length > 0"
                            v-for="post in user.posts"

                            :post="post"
                            isUserPost
                        ></Post>

                        <div
                            v-if="!loading && user.posts.length === 0"
                        >This user has not posted anything yet</div>
                    </div>
                </o-tab-item>

                <!-- Followers -->
                <o-tab-item>
                    <template #header>
                        <o-icon 
                            pack="fas"
                            icon="users"
                            size="large"
                            rootClass="icon-purple relations--icon"
                        ></o-icon>
                        <span class="relations--title">Followers</span>
                    </template>

                    <div class="grid">
                        <UserProfileCard
                            v-if="loading"
                            v-for="_ in 11"
                            
                            handle=""
                            display_name=""

                            loading inline compact
                            reducedmargin
                        ></UserProfileCard>

                        <UserProfileCard
                            v-if="!loading && user.followers.length > 0"
                            v-for="u in user.followers"
                            
                            :handle="u.handle"
                            :display_name="u.display_name"

                            inline compact clickable
                            reducedmargin
                        ></UserProfileCard>

                        <div
                            class="nothing"
                            v-if="!loading && user.followers.length === 0"
                        >This user has no followers</div>
                    </div>
                </o-tab-item>

                <!-- Following -->
                <o-tab-item>
                    <template #header>
                        <o-icon 
                            pack="fas"
                            icon="address-book"
                            size="large"
                            rootClass="icon-purple relations--icon"
                        ></o-icon>
                        <span class="relations--title">Following</span>
                    </template>

                    <div class="grid">
                        <UserProfileCard
                            v-if="loading"
                            v-for="_ in 11"
                            
                            handle=""
                            display_name=""

                            loading inline compact
                            reducedmargin
                        ></UserProfileCard>

                        <UserProfileCard
                            v-if="!loading && user.following.length > 0"
                            v-for="u in user.following"
                            
                            :handle="u.handle"
                            :display_name="u.display_name"

                            inline compact clickable
                            reducedmargin
                        ></UserProfileCard>

                        <div
                            class="nothing"
                            v-if="!loading && user.following.length === 0"
                        >This user is not following any account</div>
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

        @include for-up-to-tablet
            flex-direction: column
            margin-bottom: 2em

        .settings-button
            margin-right: 1em
    
    .relations
        .grid
            display: grid
            grid-template: auto / repeat(3, auto)

            .nothing
                grid-column: 1/3

            @include for-up-to-tablet
                display: flex
                flex-direction: column

        .posts
            display: flex
            flex-direction: column
            gap: 1em

        &--title
            @include for-up-to-tablet
                display: none

        &--icon
            @include for-up-to-tablet
                margin-right: 0
</style>