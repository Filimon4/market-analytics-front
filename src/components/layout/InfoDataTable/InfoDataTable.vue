<template>
  <CustomDataTable
    :columns="columns"
    :data="items"
    v-model:page="currentPage"
    v-model:pageSize="pageSize"
    v-model:filters="tableFilters"
    :total="totalCount"
    @change="fetchData"
  >
    <template #header="{ column, value, updateValue }">
      <div class="custom-header">
        <div class="title">{{ column.title }}</div>

        <n-input
          v-if="column.filterType === 'text'"
          v-model:value="localFilters[column.key]"
          placeholder="Filter..."
          size="small"
          @update:value="updateValue($event)"
        />

        <n-select
          v-else-if="column.filterType === 'select'"
          v-model:value="localFilters[column.key]"
          :options="column.options"
          placeholder="All"
          size="small"
          clearable
          @update:value="updateValue($event)"
        />

        <n-input-number
          v-else-if="column.filterType === 'number'"
          v-model:value="localFilters[column.key]"
          placeholder="≥"
          size="small"
          @update:value="updateValue($event)"
        />
      </div>
    </template>
  </CustomDataTable>
</template>

<script setup>
import { ref, watch } from 'vue';
import CustomDataTable from '../CustomDataTable/CustomDataTable.vue';

const columns = ref([
  { key: 'name', title: 'Name', filterType: 'text' },
  { key: 'code', title: 'Code', filterType: 'text' },
  { key: 'age',  title: 'Age',  filterType: 'number', width: '120px' },
  {
    key: 'type',
    title: 'Type',
    filterType: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User',  value: 'user'  },
      { label: 'Guest', value: 'guest' }
    ]
  }
])

const items = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const tableFilters = ref({})
const localFilters = ref({}) // helper for two-way binding in slot

watch(tableFilters, (newVal) => {
  localFilters.value = { ...newVal }
}, { deep: true })

async function fetchData() {
  console.log('Fetch triggered →', {
    page: currentPage.value,
    pageSize: pageSize.value,
    filters: tableFilters.value
  })

  await new Promise(r => setTimeout(r, 400))
  items.value = Array(18).fill().map((_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    code: `P${10000 + i}`,
    age: 18 + Math.floor(Math.random() * 40),
    type: ['admin', 'user', 'guest'][i % 3]
  }))
  totalCount.value = 385
}

watch([currentPage, pageSize, tableFilters], fetchData, { deep: true, immediate: true })

</script>
