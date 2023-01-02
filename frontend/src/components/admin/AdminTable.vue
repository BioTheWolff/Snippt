<script setup lang="ts">
import type { TableColumnsType } from '@/services/api-utils';
import { ref } from 'vue';

const props = defineProps({
    data: Array,
    columns: {}
})
const _columns = props.columns as TableColumnsType;

const currentPage = ref(1);
</script>

<template>
    <o-table 
        :data="data"
        striped hoverable
        mobile-cards

        v-model:current-page="currentPage"
        paginated per-page="5"
        pagination-simple

        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
    >
        <o-table-column
            v-for="column in _columns"
            v-bind="column"
            #default="{ row }">
            {{ row[column.field]}}
        </o-table-column>
    </o-table>
</template>