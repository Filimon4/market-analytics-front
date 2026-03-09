<template>
  <div class="data-table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="col in columns as any[]" :key="col.key">
            <slot
              name="header"
              :column="col"
              :value="filters[col.key]"
              :update-value="(v: any) => updateFilter(col.key, v)"
            >
              <div class="default-header">
                <div class="title">{{ col.title || col.key }}</div>
              </div>
            </slot>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in data as any[]" :key="row.id || JSON.stringify(row)">
          <td v-for="col in columns as any[]" :key="col.key">
            {{ getCellValue(row, col) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="data-table-pagination">
      <n-pagination
        v-model:page="localPage"
        v-model:page-size="localPageSize"
        :page-count="maxPage"
        :page-sizes="[10,20]"
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

  const props = defineProps({
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    total: {
      type: Number,
      default: 0
    },
    maxPage: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits([
    'update:page',
    'update:pageSize',
    'update:filters',
    'click'
  ])

  const filters = ref<Record<string, string>>({}) // or accept as prop if parent controls it fully

  const localPage = ref(props.page)
  const localPageSize = ref(props.maxPage)

  function getCellValue(row: any, col: any) {
    if (col.render) return col.render(row)
    return row[col.key] ?? '—'
  }

  function updateFilter(key: any, value: any) {
    filters.value[key] = value
    emit('update:filters', { ...filters.value })
    localPage.value = 1
    emit('update:page', 1)
  }

  function onPageChange(newPage: any) {
    localPage.value = newPage
    emit('update:page', newPage)
  }

  function onPageSizeChange(newSize: any) {
    localPageSize.value = newSize
    localPage.value = 1 // reset page when size changes
    emit('update:pageSize', newSize)
    emit('update:page', 1)
  }

  watch(() => props.page, (val) => { localPage.value = val })
  watch(() => props.pageSize, (val) => { localPageSize.value = val })
</script>

<style scoped>
  .data-table-wrapper {
    padding: 10px;
    overflow-x: auto;
  }
  
  .data-table {
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

  .data-table th,
  .data-table td {
    padding: 10px 12px;
    border: 1px solid #e8e8e8;
    text-align: left;
  }

  .data-table th {
    background: #fafafa;
    font-weight: 600;
  }

  .data-table tbody tr:hover {
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