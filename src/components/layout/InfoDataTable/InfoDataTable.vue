<template>
  <CustomDataTable
    :columns="tableColumns"
    :data="tableItems"
    v-model:page="pageCurrent"
    v-model:pageSize="pageSize"
    v-model:filters="tableFilters"
    v-model:maxPage="pageMax"
    :total="itemsTotal"
    @change="fetchData"
    @click:entity="handleClickEntity"
  >
    <template #header="{ column, value, updateValue }">
      <div class="custom-header">
        <div class="title">{{ column.name }}</div>
        <template v-if="column.filtrable !== false">
          <n-input
            v-if="column.type === 'string'"
            v-model:value="tableFilters[column.key]"
            placeholder=""
            size="small"
            :bordered="false"
            @update:value="updateValue($event)"
          />
  
          <n-select
            v-else-if="column.type === 'select'"
            v-model:value="tableFilters[column.key]"
            :options="column.options"
            placeholder=""
            size="small"
            :bordered="false"
            clearable
            @update:value="updateValue($event)"
          />
  
          <n-input-number
            v-else-if="column.type === 'number'"
            v-model:value="tableFilters[column.key]"
            placeholder=""
            size="small"
            :bordered="false"
            @update:value="updateValue($event)"
          />

          <n-select
            v-if="column.type === 'boolean'"
            v-model:value="tableFilters[column.key]"
            :options="[
              { label: 'Все', value: '' },
              { label: 'Да', value: 'true' },
              { label: 'Нет', value: 'false' }
            ]"
            size="small"
            :bordered="false"
            placeholder=""
            @update:value="updateValue"
          />
        </template>
      </div>
    </template>

    <template #row="{row, col}">
      {{ renderRow(row, col) }}
    </template>
  </CustomDataTable>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue'
import CustomDataTable from '../CustomDataTable/CustomDataTable.vue'
import { useRouter } from 'vue-router'
import type { ColumnDefinition } from '../CustomDataTable/CustomDataTable.type'

const router = useRouter()

const props = defineProps({
  redirectEntityUrl: {
    required: true,
    type: String,
  },
  fetchDataReq: {
    required: true,
    type: Function as PropType<(page: number, size: number, filters: Record<string, string | number>) => Promise<any>>,
  },
  defaultPageSize: {
    type: Number,
    default: 10,
    required: true
  }
})

// Data table
const tableItems = ref([])
const tableColumns = ref<ColumnDefinition[]>([])
const tableFilters = ref<any>({})

// Date page
const pageCurrent = ref<number>(1)
const pageSize = ref<number>(props.defaultPageSize)
const pageMax = ref<number>(0)
const itemsTotal = ref<number>(0)

const handleClickEntity = (entity: any) => {
  router.push(`${props.redirectEntityUrl}/${entity.id}`)
}

const fetchData = async () => {
  const allData = await props.fetchDataReq(pageCurrent.value, pageSize.value, tableFilters.value)
  tableItems.value = allData.data
  tableColumns.value = allData.columns

  pageMax.value = allData.data.maxPage
  itemsTotal.value = allData.data.total
}

const renderRow = (row: any, col: any) => {

  if (col.type === 'boolean') {
    return row[col.code] ? "Да" : "Нет"
  }

  return row[col.code]
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
  .custom-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 100px;
  }
</style>