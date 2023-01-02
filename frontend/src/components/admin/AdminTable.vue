<script setup lang="ts">
import type { TableColumnsType } from '@/services/api-utils';

const props = defineProps({
    data: Array,
    columns: {}
})
const _columns = props.columns as TableColumnsType;
</script>

<template>
    <o-table :data="data">
        <o-table-column
            v-for="column in _columns"
            v-bind="column"
            #default="{ row }">
            {{ row[column.field]}}
        </o-table-column>
    </o-table>
</template>