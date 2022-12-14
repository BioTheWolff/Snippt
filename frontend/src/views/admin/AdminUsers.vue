<script setup lang="ts">
import AdminTable from '@/components/admin/AdminTable.vue';
import type { TableColumnsType } from '@/services/api-utils';
import { disableUser, enableUser, getAllUsers, type AdminUserProfileType } from '@/services/admin';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserProfileCard from '@/components/users/UserProfileCard.vue';

const router = useRouter();

const users = ref(await getAllUsers());
if (!users.value) {
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

const selectedData = ref();


async function disable() {
    if (await disableUser(selectedData.value.handle)) {
        let _users = (users.value as AdminUserProfileType[])
        let index = _users.indexOf(
            (_users.find(u => u.handle === selectedData.value.handle) as AdminUserProfileType)
        );
        (users.value as AdminUserProfileType[])[index]['disabled'] = "true";
    } 
}

async function enable() {
    if (await enableUser(selectedData.value.handle)) {
        let _users = (users.value as AdminUserProfileType[])
        let index = _users.indexOf(
            (_users.find(u => u.handle === selectedData.value.handle) as AdminUserProfileType)
        );
        (users.value as AdminUserProfileType[])[index]['disabled'] = "false";
    } 
}
</script>

<template>
    <AdminTable
        :data="(users as AdminUserProfileType[])"
        :columns="columns"
        @selected="(data) => {selectedData = data}"
    >
        <div class="user-editor make-card" v-if="selectedData">
            <UserProfileCard
                :handle="selectedData.handle"
                :display_name="selectedData.display_name"
                inline reducedmargin
            ></UserProfileCard>
            <div class="actions">
                <o-button 
                    v-if="selectedData.disabled"
                    variant="success"
                    icon-right="user"
                    @click="enable()"
                >Enable account</o-button>
                <o-button 
                    v-else
                    variant="danger"
                    icon-right="user-slash"
                    @click="disable()"
                >Disable account</o-button>
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