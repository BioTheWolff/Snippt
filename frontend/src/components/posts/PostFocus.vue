<script setup lang="ts">
import Post from '@@/posts/Post.vue';
import { viewPost, type PostType } from '@/services/posts';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import { ref, watch, type Ref } from 'vue';

const route = useRoute();
const currentUser = useUserStore();

let chain: Ref<PostType[]> = ref([]);
let current: Ref<PostType|undefined> = ref();
let answers: Ref<PostType[]> = ref([]);

async function load() {
    chain.value = await viewPost(route.params.id as string);
    current.value = chain.value.pop() as PostType;
    answers.value = current.value.answers;
}

await load();
watch(() => route.fullPath, load);
</script>

<template>
    <div class="post-focus">
        <div class="chain" v-if="chain.length > 0">
            <template v-for="post in chain" :key="post.id">
                <Post
                    :post="post"
                    is-compact

                    :current-user-likes="currentUser.likes"
                    :current-user-dislikes="currentUser.dislikes"
                ></Post>
                <o-icon 
                    pack="fas" 
                    icon="arrow-down" 
                    size="large"
                > </o-icon>
            </template>
        </div>
        <Post
            :post="current"
            is-focused

            :current-user-likes="currentUser.likes"
            :current-user-dislikes="currentUser.dislikes"
        ></Post>
        <div class="answers" v-if="answers.length > 0">
            <div class="answers--title">{{ answers.length > 1 ? 'Answers': 'Answer' }}</div>
            <template v-for="answer in answers" :key="answer.id">
                <Post
                    :post="answer"
                    no-answers

                    :current-user-likes="currentUser.likes"
                    :current-user-dislikes="currentUser.dislikes"
                ></Post>
            </template>
        </div>
    </div>
</template>

<style scoped lang="sass">
.post-focus
    display: flex
    flex-direction: column
    justify-content: stretch
    align-items: center
    padding-bottom: 4em

    .end-posts
        margin-bottom: 4em

    @include for-up-to-tablet
        width: 95%
        margin: 0 2.5%

    .chain, .answers
        display: flex
        flex-direction: column
        align-items: center
        width: 90%
        margin-top: 2em

        &--title
            font-size: 2em

    .answers
        gap: 1em
</style>