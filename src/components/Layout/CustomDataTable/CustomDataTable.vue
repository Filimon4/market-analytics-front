<template>
  <div class="data-table-wrapper">
    <div class="data-body-wrapper">
      <table class="data-body">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.code">
              <slot
                name="header"
                :column="col"
                :value="filters[col.code]"
                :update-value="(v: any) => updateFilter(col.code, v)"
              >
                <div class="default-header">
                  <p class="title">{{ col.name }}</p>
                </div>
              </slot>
            </th>
          </tr>
        </thead>

        <div v-if="loading" class="data-body-loading">
          <n-spin stroke="#2f9acc" />
        </div>
        <tbody v-else>
          <tr class="default-row" v-for="row in data" :key="row.id">
            <td v-for="col in columns" :key="col.code" @click="emit('click:entity', row)">
              <slot name="row" :row="row" :col="col">
                {{ col.code ? getValueForField(col.code, row) : '—' }}
              </slot>
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
        :page-sizes="[10, 20]"
        :show-size-picker="true"
        size="large"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onUnmounted } from 'vue'
  import { NPagination } from 'naive-ui'
  import type { ITableList, ITableRow } from '@/src/utils/api/models/infoTable.base'

  const props = withDefaults(
    defineProps<ITableList<ITableRow> & { pageSize: number; loading: boolean }>(),
    {
      loading: false,
    }
  )

  const emit = defineEmits([
    'change:page:next',
    'change:page:reset',
    'change:page:size',
    'update:pageSize',
    'click:entity',
    'click:action',
  ])

  const filters = ref<Record<string, string | number>>({})

  const localPage = ref(props.page)
  const localPageSize = ref(props.pageSize)

  const applyFilters = () => {
    localPage.value = 1
    emit('change:page:reset')
  }

  const onPageChange = (newPage: number) => {
    localPage.value = newPage
    // emit('update:page', newPage)
  }

  const onPageSizeChange = (newSize: number) => {
    localPageSize.value = newSize
    localPage.value = 1
    // emit('update:pageSize', newSize)
    // emit('update:page', 1)
  }

  const getValueForField = (field: string, row: ITableRow) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return field.split('.').reduce((obj: any, key: string) => obj?.[key], row)
  }

  watch(
    () => props.page,
    val => {
      localPage.value = val
    }
  )
  watch(
    () => props.pageSize,
    val => {
      localPageSize.value = val
    }
  )

  // #region Filter timeout
  let filterTimeout: number | undefined
  const updateFilter = (key: string, value: string | number) => {
    filters.value[key] = value

    if (filterTimeout !== undefined) {
      clearTimeout(filterTimeout)
    }

    filterTimeout = setTimeout(() => {
      applyFilters()
    }, 400)
  }

  onUnmounted(() => {
    if (filterTimeout !== undefined) {
      clearTimeout(filterTimeout)
    }
  })
  // #endregion
</script>

<style scoped>
  .data-table-wrapper {
    display: flex;
    flex-direction: column;

    height: 100%;
    width: 100%;

    padding: 24px;
    padding-top: 0;
    overflow: auto;
  }

  .data-body-wrapper {
    box-shadow: 0px 0px 6px #0000003f;
    height: 100%;

    border-radius: 8px;
    overflow: auto;
  }

  .data-body-loading {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 200px;
  }

  .data-body {
    position: relative;
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
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
    border-bottom: 1px solid #e0e0e0;
    font-size: 1.15em;
    color: #1a1a1a;
  }

  .data-body th {
    background: #f8f9fa;
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
    font-size: 1.15em;
    color: #1a1a1a;
  }

  .default-row td {
    height: 30px;
    cursor: pointer;
  }
</style>
