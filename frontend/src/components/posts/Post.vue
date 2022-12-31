<script setup lang="ts">
import { dislikePost, likePost, neutralPost, type PostType } from '@/services/posts';
import { previewCode } from '@/services/rainbow';
import { useUserStore } from '@/stores/user';
import UserProfileCard from '@@/users/UserProfileCard.vue';
import { ref } from 'vue';

const props = defineProps({
    loading: Boolean,
    post: {},
    currentUserLikes: Set,
    currentUserDislikes: Set,
})
const post: PostType = props.post as PostType;
const currentUser = useUserStore();

const isLiked = ref(props.currentUserLikes?.has(post.id));
const isDisliked = ref(props.currentUserDislikes?.has(post.id));

const totalLikes = ref(post.total_likes);
const totalDislikes = ref(post.total_dislikes);


const previewElement = ref();
if (!props.loading) {
    setTimeout(
        () => previewCode(previewElement, post.content, post.language, true), 
        50
    );
}


async function like() {
    if (!currentUser.is_logged_in) return;

    if (isLiked.value) {
        await neutralPost(post.id);
        totalLikes.value--;
    } else {
        if (isDisliked.value) totalDislikes.value--;
        await likePost(post.id);
        totalLikes.value++;
    }
    updateLikeStatus();
}

async function dislike() {
    if (!currentUser.is_logged_in) return;

    if (isDisliked.value) {
        await neutralPost(post.id);
        totalDislikes.value--;
    } else {
        if (isLiked.value) totalLikes.value--;
        await dislikePost(post.id);
        totalDislikes.value++;
    }
    updateLikeStatus();
}

function updateLikeStatus() {
    isLiked.value = props.currentUserLikes?.has(post.id);
    isDisliked.value = props.currentUserDislikes?.has(post.id);
}
</script>

<template>
    <article class="post make-card">
        <div class="author">
            <UserProfileCard
                v-if="loading"
                handle=""
                display_name=""
                loading inline reducedmargin
            ></UserProfileCard>

            <UserProfileCard
                v-else
                :handle="post.author.handle"
                :display_name="post.author.display_name"
                inline clickable reducedmargin
            ></UserProfileCard>
        </div>
        <section class="content">
            <!-- Title -->
            <o-skeleton 
                v-if="loading"
                height="1.7em" 
                width="60%"
                class="content--title"
            ></o-skeleton>
            <div v-else class="content--title">{{ post.title }}</div>

            <!-- Description -->
            <o-skeleton
                v-if="loading"
                height="100px"
                width="85%"
                class="content--description"
            ></o-skeleton>
            <p v-else class="content--description">{{ post.description }}</p>

            <!-- Snippet -->
            <pre v-if="loading"><code></code></pre>
            <pre v-else ref="previewElement"></pre>
        </section>
        <section class="relations">
            <o-tooltip triggerClass="wrapper" label="Likes">
                <span class="value">{{ totalLikes }}</span>
                <o-icon 
                    pack="fas" 
                    icon="heart" 
                    size="large" 
                    :variant="isLiked ? 'danger' : ''"
                    @click="like()"
                > </o-icon>
            </o-tooltip>
            <o-tooltip triggerClass="wrapper" label="Dislikes">
                <span class="value">{{ totalDislikes }}</span>
                <o-icon 
                    pack="fas" 
                    icon="heart-broken" 
                    size="large" 
                    :variant="isDisliked ? 'info' : ''"
                    @click="dislike()"
                > </o-icon>
            </o-tooltip>
        </section>
    </article>
</template>

<style scoped lang="sass">
.post
    display: flex
    width: 70%
    flex-direction: column

    .content
        margin-bottom: 1em

        &--title
            font-size: 1.7em
            margin-bottom: 0.5em

        &--description
            font-size: 1.1em
            margin-bottom: 1em

    .relations
        display: flex
        gap: 1em

        .wrapper
            .value
                font-size: 1.3em
</style>