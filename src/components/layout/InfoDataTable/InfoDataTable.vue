<template>
  <CustomDataTable
    :columns="tableColumns"
    :data="tableItems"
    :actions="actions"
    v-model:page="pageCurrent"
    v-model:pageSize="pageSize"
    v-model:filters="tableFilters"
    v-model:maxPage="pageMax"
    :total="itemsTotal"
    @change="fetchData"
    @click:entity="handleClickEntity"
    @click:action="code => emit('click:action', code)"
  >
    <template #header="{ column, updateValue }">
      <div class="custom-header">
        <div class="title">{{ column.name }}</div>
        <template v-if="column.filtrable !== false">
          <n-input
            v-if="column.type === 'string'"
            v-model:value="tableFilters[column.code]"
            placeholder=""
            size="small"
            :bordered="false"
            @update:value="updateValue($event)"
          />

          <n-select
            v-else-if="column.type === 'constants'"
            v-model:value="tableFilters[column.code]"
            :options="column.constantList"
            placeholder=""
            size="small"
            :bordered="false"
            clearable
            @update:value="updateValue($event)"
          />

          <n-input-number
            v-else-if="column.type === 'number'"
            v-model:value="tableFilters[column.code]"
            placeholder=""
            size="small"
            :bordered="false"
            @update:value="updateValue($event)"
          />

          <n-select
            v-if="column.type === 'boolean'"
            v-model:value="tableFilters[column.code]"
            :options="[
              { label: 'Все', value: '' },
              { label: 'Да', value: 'true' },
              { label: 'Нет', value: 'false' },
            ]"
            size="small"
            :bordered="false"
            placeholder=""
            @update:value="updateValue"
          />
        </template>
      </div>
    </template>

    <template #row="{ row, col }">
      {{ renderRow(row, col) }}
    </template>
  </CustomDataTable>
</template>

<script setup lang="ts">
  import { onMounted, ref, type PropType } from 'vue'
  import CustomDataTable from '../CustomDataTable/CustomDataTable.vue'
  import { useRouter } from 'vue-router'
  import type {
    Action,
    DataRow,
    ITableColumn,
    ITableList,
  } from '../CustomDataTable/CustomDataTable.type'

  const emit = defineEmits(['click:action'])

  const router = useRouter()

  const props = defineProps({
    redirectEntityUrl: {
      required: true,
      type: String,
    },
    fetchDataReq: {
      required: true,
      type: Function as PropType<
        <T extends DataRow>(
          page: number,
          size: number,
          filters: Record<string, string | number>
        ) => Promise<ITableList<T[]>>
      >,
    },
    defaultPageSize: {
      type: Number,
      default: 10,
      required: true,
    },
    actions: {
      required: false,
      type: Array as PropType<Action[]>,
    },
  })

  // Data table
  const tableItems = ref<DataRow[]>([])
  const tableColumns = ref<ITableColumn[]>([])
  const tableFilters = ref<Record<string, string | number>>({})

  // Date page
  const pageCurrent = ref<number>(1)
  const pageSize = ref<number>(props.defaultPageSize)
  const pageMax = ref<number>(0)
  const itemsTotal = ref<number>(0)

  const handleClickEntity = (entity: DataRow) => {
    router.push(`${props.redirectEntityUrl}/${entity.id}`)
  }

  const fetchData = async () => {
    const allData = await props.fetchDataReq(pageCurrent.value, pageSize.value, tableFilters.value)
    tableItems.value = allData.data || []
    tableColumns.value = allData.columns

    pageMax.value = allData.maxPage
    itemsTotal.value = allData.total
  }

  const renderRow = (row: DataRow, col: ITableColumn) => {
    const value = col?.path ? getValueForField(col.path, row) : row[col.code]

    if (col.type === 'boolean') {
      return value ? 'Да' : 'Нет'
    }

    return value
  }

  const getValueForField = (field: string, data: object) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return field.split('.').reduce((obj: any, key: string) => obj?.[key], data)
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
