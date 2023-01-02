<script setup lang="ts">
import AdminTable from '@/components/admin/AdminTable.vue';
import type { TableColumnsType } from '@/services/api-utils';
import { getAllUsers, type AdminUserProfileType } from '@/services/users';
import { useRouter } from 'vue-router';

const router = useRouter();

const users = await getAllUsers();
if (!users) {
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
</script>

<template>
    <AdminTable
        :data="(users as AdminUserProfileType[])"
        :columns="columns"
    ></AdminTable>
</template>