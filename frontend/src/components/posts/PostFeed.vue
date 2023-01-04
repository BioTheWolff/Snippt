<script setup lang="ts">
import Post from '@@/posts/Post.vue';
import { loadPosts as apiLoadPosts, type PostType, type UserPostType } from '@/services/posts';
import { ref, type Ref } from 'vue';
import { useUserStore } from '@/stores/user';

const limit = 2;
let page = 1;

const posts: Ref<PostType[]> = ref([]);
const loadMore = ref(true);
const noPosts = ref(false);
const currentUser = useUserStore();

async function loadPosts() {
    let retrieved = await apiLoadPosts(limit, page);

    if (retrieved.length < limit) {
        if (posts.value.length === 0) noPosts.value = true;
        loadMore.value = false;
    } else {
        page++;
        posts.value.push(...retrieved);
    }
}

loadPosts();

const placeholderPost: UserPostType = {
    id: -1,
    title: 'Snippt - the social network, code oriented',
    description: 'Here you can post whatever you want, and especially code snippets! Descriptions are always nice, but you should keep them short',
    language: 'javascript',
    content: 'public const Boolean open = true;',
    total_dislikes: 0,
    total_likes: 0,
    answers: [],
    parent: null
}
</script>

<template>
    <div class="feed">
        <Post
            v-for="post in posts"
            :key="post.id"
            :post="post"
            :current-user-likes="currentUser.likes"
            :current-user-dislikes="currentUser.dislikes"
        ></Post>

        <o-button 
            v-if="loadMore"
            variant="info"
            @click="loadPosts()"
            class="end-posts"
        >Load more</o-button>


        <div
            class="no-posts-wrapper" 
            v-if="!loadMore && noPosts"
        >
            <Post  
                :post="placeholderPost"
                no-answers is-user-post
                disable-click disable-actions
            ></Post>
        </div>
        <div 
            v-if="!loadMore && !noPosts" 
            class="end-posts"
        >You reached the end! How did you??</div>
    </div>
</template>

<style scoped lang="sass">
.feed
    display: flex
    flex-direction: column
    justify-content: stretch
    align-items: center
    gap: 2em

    .end-posts
        margin-bottom: 4em

    @include for-up-to-tablet
        width: 95%
        margin: 0 2.5%

    .no-posts-wrapper
        display: flex
        justify-content: center
</style>