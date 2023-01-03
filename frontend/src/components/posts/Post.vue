<script setup lang="ts">
import router from '@/router';
import { dislikePost, likePost, neutralPost, type PostType } from '@/services/posts';
import { previewCode } from '@/services/rainbow';
import { useUserStore } from '@/stores/user';
import UserProfileCard from '@@/users/UserProfileCard.vue';
import { ref, watch, type Ref } from 'vue';

const props = defineProps({
    loading: Boolean,
    isUserPost: Boolean,
    isFocused: Boolean,
    isCompact: Boolean,
    noAnswers: Boolean,
    disableActions: Boolean,
    post: {},
    currentUserLikes: Set,
    currentUserDislikes: Set,
})
let post: Ref<PostType> = ref(props.post as PostType);
const currentUser = useUserStore();

const isLiked = ref(props.currentUserLikes?.has(post.value.id));
const isDisliked = ref(props.currentUserDislikes?.has(post.value.id));

const totalLikes = ref(post.value.total_likes);
const totalDislikes = ref(post.value.total_dislikes);

const likesText = ref(
    !currentUser.is_logged_in
    ? 'Likes'
    : (isLiked ? 'Remove reaction' : 'Like')
);
const dislikesText = ref(
    !currentUser.is_logged_in
    ? 'Dislikes'
    : (isDisliked ? 'Remove reaction' : 'Dislike')
);
const answersText = ref(
    props.isFocused
    ? (!currentUser.is_logged_in ? 'Log in to write an answer' : 'Write an answer')
    : 'Answers'
);


const previewElement = ref();
function runCodePreview() {
    if (!props.loading && !props.isCompact && !post.value.deleted) {
        previewCode(previewElement, post.value.content, post.value.language, true)
    }
}

setTimeout(runCodePreview, 50);


async function like() {
    if (!currentUser.is_logged_in) return;
    if (props.disableActions) return;

    if (isLiked.value) {
        await neutralPost(post.value.id);
        totalLikes.value--;
    } else {
        if (isDisliked.value) totalDislikes.value--;
        await likePost(post.value.id);
        totalLikes.value++;
    }
    updateLikeStatus();
}

async function dislike() {
    if (!currentUser.is_logged_in) return;
    if (props.disableActions) return;

    if (isDisliked.value) {
        await neutralPost(post.value.id);
        totalDislikes.value--;
    } else {
        if (isLiked.value) totalLikes.value--;
        await dislikePost(post.value.id);
        totalDislikes.value++;
    }
    updateLikeStatus();
}

function updateLikeStatus() {
    isLiked.value = props.currentUserLikes?.has(post.value.id);
    isDisliked.value = props.currentUserDislikes?.has(post.value.id);
}

function resetLikes() {
    totalLikes.value = post.value.total_likes;
    totalDislikes.value = post.value.total_dislikes;
    updateLikeStatus();
}

watch(() => props.post, () => {
    post.value = props.post as PostType;
    resetLikes();
    runCodePreview();
})


function focus() {
    router.push({ name: 'view-post', params: {id: post.value.id} })
}

function answer() {
    if (props.isFocused) {
        // cancel answering and focus instead if actions are disabled
        if (props.disableActions) focus();

        if (currentUser.is_logged_in) {
            router.push({ name: 'answer-post', params: {id: post.value.id} })
        }
    } else {
        focus();
    }
}
</script>

<template>
    <article :class="`post make-card ${isUserPost ? 'user-post' : ''} 
        ${isCompact ? 'compact' : ''}`"
    >
        <div class="author" v-if="!isUserPost">
            <UserProfileCard
                v-if="loading"
                handle=""
                display_name=""
                loading inline reducedmargin
                :compact="isCompact"
            ></UserProfileCard>

            <UserProfileCard
                v-else
                :handle="post.author.handle"
                :display_name="post.author.display_name"
                inline clickable reducedmargin
                :compact="isCompact"
            ></UserProfileCard>
        </div>
        <section class="content" @click="focus()">
            <!-- Title -->
            <o-skeleton 
                v-if="loading"
                height="1.7em" 
                width="60%"
                class="content--title"
            ></o-skeleton>
            <div v-else class="content--title">{{ post.title }}</div>

            <o-notification 
                v-if="!loading && post.deleted"
                noticeClass="empty"
                type="danger" variant="danger"
            >
                This post has been deleted.
            </o-notification>

            <!-- Description -->
            <o-skeleton
                v-if="loading"
                height="100px"
                width="85%"
                class="content--description"
            ></o-skeleton>
            <p 
                v-if="!loading && !isCompact && !post.deleted"
                class="content--description"
            >{{ post.description }}</p>

            <!-- Snippet -->
            <pre v-if="loading"><code></code></pre>
            <pre 
                v-if="!loading && !isCompact && !post.deleted"
                ref="previewElement"
            ></pre>
        </section>
        <section class="relations" v-if="!loading">
            <o-tooltip triggerClass="wrapper" :label="likesText">
                <span class="value">{{ totalLikes }}</span>
                <o-icon 
                    pack="fas" 
                    icon="heart"
                    :size="!isCompact ? 'large' : 'medium'" 
                    :variant="isLiked ? 'danger' : ''"
                    @click="like()"
                > </o-icon>
            </o-tooltip>
            <o-tooltip triggerClass="wrapper" :label="dislikesText">
                <span class="value">{{ totalDislikes }}</span>
                <o-icon 
                    pack="fas" 
                    icon="heart-broken"
                    :size="!isCompact ? 'large' : 'medium'" 
                    :variant="isDisliked ? 'info' : ''"
                    @click="dislike()"
                > </o-icon>
            </o-tooltip>

            <o-tooltip triggerClass="wrapper" :label="answersText" v-if="!isCompact && !noAnswers">
                <span class="value">{{ post.answers.length }}</span>
                <o-icon 
                    pack="fas" 
                    icon="message" 
                    size="large"
                    @click="answer()"
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

    @include for-up-to-tablet
        width: 100%

    &.user-post
        background: $primary

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

    &.compact

        .content
            margin-bottom: 0

            &--title
                font-size: 1.3em
                margin-bottom: 0

        .relations .wrapper .value
            font-size: 0.9em
</style>