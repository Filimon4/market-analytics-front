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
                  <p class="title">{{ col.name }}</p>
                </div>
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in data as any[]" :key="row.id || JSON.stringify(row)">
            <td v-for="col in columns as any[]" :key="col.key" @click="emit('click:entity', row)">
              <slot
                name="row"
                :row="row"
                :col="col"
              >
                {{ row[col.code] ?? '—' }}
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
  import type { Props } from './CustomDataTable.type';

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
    width: 100%;
    padding: 24px;
    overflow: auto;
  }
  
  .data-body-wrapper {
    border-radius: 8px;
    overflow: auto;
  }

  .data-body {
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
</style>