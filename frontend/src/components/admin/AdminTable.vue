<script setup lang="ts">
import type { TableColumnsType } from '@/services/api-utils';
import { ref, watch } from 'vue';

const props = defineProps({
    data: Array,
    columns: {}
})
const emit = defineEmits<{
  (event: 'selected', data: any): void
}>()

const _columns = props.columns as TableColumnsType;
const _data = ref(props.data as any[]);

const currentPage = ref(1);
const selected = ref();

// preprocessing data
for (let col of _columns) {
    if (col.preprocessor) {
        for (let index in _data.value) {
            _data.value[index][col.field] = col.preprocessor(_data.value[index][col.field]);
        }
    }
}

watch(selected, () => emit('selected', selected.value));
</script>

<template>
    <o-table 
        :data="data"
        striped hoverable
        mobile-cards
        v-model:selected="selected"

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

    <div class="admin-table-slot">
        <slot/>
    </div>
</template>

<style scoped lang="sass">
.admin-table-slot
    margin: 4em 0
</style>