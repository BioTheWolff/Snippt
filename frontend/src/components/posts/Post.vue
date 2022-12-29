<script setup lang="ts">
import type { PostType } from '@/services/posts';
import { previewCode } from '@/services/rainbow';
import UserProfileCard from '@@/users/UserProfileCard.vue';
import { ref } from 'vue';

const props = defineProps({
    loading: Boolean,
    post: {},
})
const post: PostType = props.post as PostType;

const previewElement = ref();

if (!props.loading) {
    setTimeout(
        () => previewCode(previewElement, post.content, post.language, true), 
        50
    );
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
                <span class="value">{{ post.total_likes }}</span>
                <o-icon pack="fas" icon="heart" size="large" variant=""> </o-icon>
            </o-tooltip>
            <o-tooltip triggerClass="wrapper" label="Dislikes">
                <span class="value">{{ post.total_dislikes }}</span>
                <o-icon pack="fas" icon="heart-broken" size="large" variant=""> </o-icon>
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