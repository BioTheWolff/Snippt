<script setup lang="ts">
import AdminTable from '@/components/admin/AdminTable.vue';
import { getAllUsers, type AdminUserProfileType } from '@/services/users';
import { useRouter } from 'vue-router';

const router = useRouter();

const users = await getAllUsers();
if (!users) {
    // replace route because the user is not authorized as admin
    router.replace('/');
}

const columns = [
    {
        field: 'id',
        label: 'ID',
        numeric: true,
    },
    {
        field: 'handle',
        label: 'Handle',
    },
    {
        field: 'display_name',
        label: 'Display name',
    },
    {
        field: 'email',
        label: 'E-mail',
    },
    {
        field: 'disabled',
        label: 'Disabled',
        boolean: true
    },
    {
        field: 'admin',
        label: 'Admin',
        boolean: true
    },
];
</script>

<template>
    <AdminTable
        :data="(users as AdminUserProfileType[])"
        :columns="columns"
    ></AdminTable>
</template>