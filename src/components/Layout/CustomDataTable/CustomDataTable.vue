<template>
  <div class="data-table-wrapper">
    <div class="data-body-wrapper">
      <table class="data-body">
        <thead>
          <tr>
            <th v-for="col in infoDataTableStore.getColumns()" :key="col.code">
              <slot
                name="header"
                :column="col"
                :value="props.filters[col.code]"
                :update-value="(v: any) => updateFilter(col.code, v)"
              >
                <div class="default-header">
                  <p class="title">{{ col.name }}</p>
                </div>
              </slot>
            </th>
          </tr>
        </thead>

        <div v-if="props.loading" class="data-body-loading">
          <n-spin stroke="#2f9acc" />
        </div>
        <tbody v-else>
          <tr class="default-row" v-for="row in infoDataTableStore.getTableData()" :key="row.id">
            <td
              v-for="col in infoDataTableStore.getColumns()"
              :key="col.code"
              @click="emit('click:entity', row)"
            >
              <slot name="row" :row="row" :col="col">
                {{ col.code ? getValueForField(col.code, row) : '-' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="data-table-pagination">
      <n-pagination
        :page="infoDataTableStore.getPage()"
        :page-size="infoDataTableStore.getPageSize()"
        :item-count="infoDataTableStore.getTotal()"
        :page-sizes="[10, 20]"
        :show-size-picker="true"
        size="large"
        @update:page="infoDataTableStore.setPage"
        @update:page-size="infoDataTableStore.setPageSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onUnmounted } from 'vue'
  import { NPagination } from 'naive-ui'
  import type { ITableRow } from '@/src/utils/api/models/infoTable.base'
  import { useInfoDataTableStore } from '@/src/store/infoDataTable.ts'

  const infoDataTableStore = useInfoDataTableStore()

  const props = withDefaults(
    defineProps<{ loading: boolean; filters: Record<string, string | number> }>(),
    {
      loading: false,
      filters: () => ({}),
    }
  )

  const emit = defineEmits(['update:filters', 'click:entity', 'click:action'])

  const applyFilters = () => {
    void infoDataTableStore.resetPage()
  }

  const getValueForField = (field: string, row: ITableRow) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return field.split('.').reduce((obj: any, key: string) => obj?.[key], row)
  }

  // #region Filter timeout
  let filterTimeout: number | undefined
  const updateFilter = (key: string, value: string | number) => {
    emit('update:filters', {
      ...props.filters,
      [key]: value,
    })

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
