<script setup lang="ts">
import AdminTable from '@/components/admin/AdminTable.vue';
import type { TableColumnsType } from '@/services/api-utils';
import { deletePost as apiDeletePost, getAllPosts, type AdminPostType } from '@/services/admin';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Post from '@@/posts/Post.vue';

const router = useRouter();

const posts = ref(await getAllPosts());
if (!posts.value) {
    // replace route because the user is not authorized as admin
    router.replace('/');
}

const columns: TableColumnsType = [
    {
        field: 'id',
        label: 'ID',
        numeric: true,
    },
    {
        field: 'title',
        label: 'Title',
    },
    {
        field: 'total_likes',
        label: 'Likes',
    },
    {
        field: 'total_dislikes',
        label: 'Dislikes',
    },
    {
        field: 'deleted',
        label: 'Deleted',
        boolean: true
    },
    {
        field: 'created_at',
        label: 'Created at',
        preprocessor: (data: string) => (new Date(data)).toLocaleString("fr-FR")
    },
    {
        field: 'updated_at',
        label: 'Updated at',
        preprocessor: (data: string) => (new Date(data)).toLocaleString("fr-FR")
    }
];

const selectedData = ref();


async function deletePost() {
    if (await apiDeletePost(selectedData.value.id)) {
        let _users = (posts.value as AdminPostType[])
        let index = _users.indexOf(
            (_users.find(u => u.id === selectedData.value.id) as AdminPostType)
        );
        (posts.value as AdminPostType[])[index]['deleted'] = "true";
    } 
}
</script>

<template>
    <AdminTable
        :data="(posts as AdminPostType[])"
        :columns="columns"
        @selected="(data) => {selectedData = data}"
    >
        <div class="post-editor make-card" v-if="selectedData">
            <Post
                :post="selectedData"
                is-compact
                disable-actions
                no-answers
            ></Post>
            <div class="actions">
                <o-button 
                    v-if="!selectedData.deleted"
                    variant="danger"
                    icon-right="trash"
                    @click="deletePost()"
                >Delete post</o-button>
            </div>
        </div>
    </AdminTable>
</template>

<style scoped lang="sass">
.user-editor
    display: flex
    background: $card-bg
    align-items: center
    justify-content: space-between

    & > *
        margin-bottom: 0 !important

    .actions
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        gap: 0.5em
        margin-right: 2em
</style>