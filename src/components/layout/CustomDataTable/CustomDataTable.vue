<template>
  <div class="data-table-wrapper">
    <div class="block-actions" v-if="actions">
      <button
        v-for="action in actions"
        :key="action.code"
        class="action-btn"
        :class="`size-${action.size}`"
        @click="clickAction(action.code)"
      >
        {{ action.title }}
      </button>
    </div>

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
  import { ref, watch, onUnmounted } from 'vue'
  import { NPagination } from 'naive-ui' // or use auto-import if configured
  import type { Props } from './CustomDataTable.type';

  const props = withDefaults(defineProps<Props>(), {
    data:     () => [],
    page:     1,
    pageSize: 20,
    total:    0,
    maxPage:  0,
    actions:  () => []
  })

  const emit = defineEmits([
    'update:page',
    'update:pageSize',
    'update:filters',
    'click:entity',
    'click:action',
    'change',
  ])

  const filters = ref<Record<string, string>>({}) // or accept as prop if parent controls it fully

  const localPage = ref(props.page)
  const localPageSize = ref(props.pageSize)

  let filterTimeout: number | undefined

  const applyFilters = () => {
    emit('update:filters', { ...filters.value })
    localPage.value = 1
    emit('update:page', 1)
    emit('change')
  }

  const updateFilter = (key: any, value: any) => {
    filters.value[key] = value

    if (filterTimeout !== undefined) {
      clearTimeout(filterTimeout)
    }

    filterTimeout = setTimeout(() => {
      applyFilters()
    }, 400)
  }

  const onPageChange = (newPage: any) => {
    localPage.value = newPage
    emit('update:page', newPage)
    emit('change')
  }

  const onPageSizeChange = (newSize: any) => {
    localPageSize.value = newSize
    localPage.value = 1
    emit('update:pageSize', newSize)
    emit('update:page', 1)
    emit('change')
  }

  const clickAction = (code: string) => {
    emit('click:action', code)
  }

  watch(() => props.page, (val) => { localPage.value = val })
  watch(() => props.pageSize, (val) => { localPageSize.value = val })

  onUnmounted(() => {
    if (filterTimeout !== undefined) {
      clearTimeout(filterTimeout)
    }
  })
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

  /* Action buttons area */
  .block-actions {
    padding: 0.75rem 1.25rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .action-btn {
    border: 1px solid #cbd5e1;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.12s;
  }

  .action-btn:hover {
    background: #f1f5f9;
  }

  /* Size variants */
  .size-small  { padding: 0.35rem 0.75rem; font-size: 0.875rem; }
  .size-medium { padding: 0.5rem 1rem;    font-size: 0.95rem;  }
  .size-large  { padding: 0.65rem 1.35rem; font-size: 1.05rem; }
</style>