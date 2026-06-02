<template>
  <div>
    <div class="block-actions" v-if="actions.length">
      <button
        v-for="action in actions"
        :key="action.code"
        class="action-btn"
        :class="`size-${action.size}`"
        @click="code => emit('click:action', code)"
      >
        {{ action.title }}
      </button>
    </div>
    <CustomDataTable
      v-model:filters="infoDataTableStore.filters"
      :loading="pageLoading"
      @click:entity="handleClickEntity"
    >
      <template #header="{ column, updateValue }">
        <div class="custom-header">
          <div class="title">{{ column.name }}</div>
          <template v-if="column.filtrable !== false">
            <n-input
              v-if="column.type === 'string'"
              v-model:value="infoDataTableStore.filters[column.code]"
              placeholder=""
              size="small"
              :bordered="false"
              @update:value="updateValue($event)"
            />

            <n-input-number
              v-else-if="column.type === 'number'"
              v-model:value="infoDataTableStore.filters[column.code]"
              placeholder=""
              size="small"
              :bordered="false"
              @update:value="updateValue($event)"
            />

            <n-select
              v-else-if="column.type === 'boolean'"
              v-model:value="infoDataTableStore.filters[column.code]"
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

            <n-select
              v-else-if="column.type === 'select'"
              :value="infoDataTableStore.filters[column.code]"
              remote
              size="small"
              :bordered="false"
              placeholder=""
              @update:value="updateValue"
              @update:show="(opened: boolean) => opened"
            />
          </template>
        </div>
      </template>

      <template #row="{ row, col }">
        <InfoField :value="resolveFieldValue(col?.path ?? col.code, row)" :type="col.type" />
      </template>
    </CustomDataTable>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, type PropType } from 'vue'
  import CustomDataTable from '../CustomDataTable/CustomDataTable.vue'
  import { useRouter } from 'vue-router'
  import { useInfoDataTableStore } from '@/src/store/infoDataTable.ts'
  import type { ITableList, ITableRow } from '@/src/utils/api/models/infoTable.base'
  import type { Action } from '../CustomDataTable/CustomDataTable.type'
  import InfoField from '../../common/InfoDataEntity/InfoField/InfoField.vue'

  const infoDataTableStore = useInfoDataTableStore()

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
        <T extends ITableRow>(
          page: number,
          size: number,
          filters: Record<string, string | number>
        ) => Promise<ITableList<T>>
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
      default: () => [],
    },
  })

  const pageLoading = ref<boolean>(false)

  const resolveFieldValue = (field: string, row: ITableRow) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return field.split('.').reduce((obj: any, key: string) => obj?.[key], row)
  }

  const handleClickEntity = (entity: ITableRow) => {
    router.push(infoDataTableStore.getEntityRedirectUrl(entity))
  }

  onMounted(async () => {
    infoDataTableStore.setInitTableData(
      props.redirectEntityUrl,
      props.defaultPageSize,
      1,
      props.fetchDataReq
    )
    infoDataTableStore.fetchPage()
  })
</script>

<style scoped>
  .custom-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 100px;
  }

  /* Action buttons area */
  .block-actions {
    padding: 24px;
    padding-bottom: 12px;
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
  .size-small {
    padding: 0.35rem 0.75rem;
    font-size: 0.875rem;
  }
  .size-medium {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
  .size-large {
    padding: 0.65rem 1.35rem;
    font-size: 1.05rem;
  }
</style>
