<script setup lang="ts">
import Post from '@@/posts/Post.vue';
import { loadPosts as apiLoadPosts, type PostType } from '@/services/posts';
import { ref, type Ref } from 'vue';
import { useUserStore } from '@/stores/user';

const limit = 2;
let page = 1;

const posts: Ref<PostType[]> = ref([]);
const loadMore = ref(true);
const currentUser = useUserStore();

async function loadPosts() {
    let retrieved = await apiLoadPosts(limit, page);

    if (retrieved.length == 0) {
        loadMore.value = false;
    } else {
        page++;
        posts.value.push(...retrieved);
    }
}

loadPosts();
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
        <div v-else class="end-posts">You reached the end! How did you??</div>
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
</style>