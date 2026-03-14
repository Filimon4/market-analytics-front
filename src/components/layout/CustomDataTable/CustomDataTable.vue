<template>
  <div class="data-table-wrapper">
    <div class="data-body-wrapper">
      <table class="data-body">
        <thead>
          <tr>
            <th v-for="col in columns as any[]" :key="col.code" >
              <slot
                name="header"
                :column="col"
                :value="filters[col.code]"
                :update-value="(v: any) => updateFilter(col.code, v)"
              >
                <div class="default-header">
                  <div class="title">{{ col.name }}</div>
                </div>
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in data as any[]" :key="row.id || JSON.stringify(row)">
            <td v-for="col in columns as any[]" :key="col.key" @click="emit('click:entity', row)">
              {{ getCellValue(row, col) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="data-table-pagination">
      <n-pagination
        v-model:page="localPage"
        v-model:page-size="localPageSize"
        :page-count="maxPage"
        :page-sizes="[10,20]"
        :show-size-picker="true"
        size="large"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { NPagination } from 'naive-ui' // or use auto-import if configured

  interface ColumnDefinition {
    key: string
    label: string
    sortable?: boolean
  }

  interface RowData {
    [key: string]: unknown
  }

  interface Props {
    columns:       ColumnDefinition[]
    data?:         RowData[]
    page?:         number
    pageSize?:     number
    total?:        number
    maxPage?:      number
  }

  const props = withDefaults(defineProps<Props>(), {
    data:     () => [],
    page:     1,
    pageSize: 20,
    total:    0,
    maxPage:  0
  })

  const emit = defineEmits([
    'update:page',
    'update:pageSize',
    'update:filters',
    'click:entity',
    'change',
  ])

  const filters = ref<Record<string, string>>({}) // or accept as prop if parent controls it fully

  const localPage = ref(props.page)
  const localPageSize = ref(props.pageSize)

  function getCellValue(row: any, col: any) {
    if (col.render) return col.render(row)
    return row[col.code] ?? '—'
  }

  function updateFilter(key: any, value: any) {
    filters.value[key] = value
    emit('update:filters', { ...filters.value })
    localPage.value = 1
    emit('update:page', 1)
    emit('change')
  }

  function onPageChange(newPage: any) {
    localPage.value = newPage
    emit('update:page', newPage)
    emit('change')
  }

  function onPageSizeChange(newSize: any) {
    localPageSize.value = newSize
    localPage.value = 1
    emit('update:pageSize', newSize)
    emit('update:page', 1)
    emit('change')
  }

  watch(() => props.page, (val) => { localPage.value = val })
  watch(() => props.pageSize, (val) => { localPageSize.value = val })
</script>

<style scoped>
  .data-table-wrapper {
    padding: 10px;
    overflow: auto;
  }
  
  .data-body-wrapper {
    overflow: auto;
  }

  .data-body {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    box-shadow: 0px 0px 10px gray;
  }

  .data-table-pagination {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }

  .data-body th,
  .data-body td {
    padding: 10px 12px;
    text-align: left;
  }

  .data-body th {
    background: #fafafa;
    font-weight: 600;
  }

  .data-body tbody tr:hover {
    background: #f5f5f5;
  }

  .default-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    font-weight: 600;
  }
</style>