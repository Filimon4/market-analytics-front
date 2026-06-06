<template>
  <div>
    <div class="block-actions" v-if="actions.length">
      <button
        v-for="action in actions"
        :key="action.code"
        class="action-btn"
        :class="`size-${action.size}`"
        @click="() => emit('click:action', action.code)"
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
              @update:value="updateValue"
            />

            <n-input-number
              v-else-if="column.type === 'number'"
              v-model:value="infoDataTableStore.filters[column.code]"
              placeholder=""
              size="small"
              :bordered="false"
              @update:value="updateValue"
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
              v-model:value="infoDataTableStore.filters[column.code]"
              :options="selectOptions[column.code] || []"
              :loading="selectLoading[column.code]"
              clearable
              size="small"
              :bordered="false"
              placeholder=""
              @update:value="updateValue"
              @update:show="(opened: boolean) => opened && fetchSelectOptions(column)"
            />

            <n-date-picker
              v-else-if="column.type === 'datetime' && column.dateTimeFilterType === 'period'"
              type="datetimerange"
              clearable
              size="small"
              :bordered="false"
              @update:value="handleDateTimePeriodChange(column.code, $event, updateValue)"
              :value="getDateTimePeriodValue(column.code)"
            />

            <n-date-picker
              v-else-if="column.type === 'datetime'"
              type="datetime"
              clearable
              size="small"
              :bordered="false"
              @update:value="handleDateTimeExactChange(column.code, $event, updateValue)"
              :value="getDateTimeExactValue(column.code)"
            />
          </template>
        </div>
      </template>

      <template #row="{ row, col }">
        <InfoTableField :value="resolveFieldValue(col?.path ?? col.code, row)" :type="col.type" />
      </template>
    </CustomDataTable>
  </div>
</template>

<script setup lang="ts">
  import { DateTime } from 'luxon'
  import { onMounted, ref, type PropType } from 'vue'
  import CustomDataTable from '../CustomDataTable/CustomDataTable.vue'
  import { useRouter } from 'vue-router'
  import { useInfoDataTableStore } from '@/src/store/infoDataTable.ts'
  import type {
    IDateTimePeriodFilter,
    ITableColumn,
    ITableFilterValue,
    ITableList,
    ITableRow,
  } from '@/src/utils/api/models/infoTable.base'
  import InfoTableField from '../../common/InfoDataEntity/InfoField/InfoTableField.vue'
  import type { Action } from '../CustomDataTable/CustomDataTable.type'
  import api from '@/src/utils/api'

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
        (
          page: number,
          size: number,
          filters: Record<string, ITableFilterValue>
        ) => Promise<ITableList<ITableRow>>
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

  const selectOptions = ref<Record<string, { label: string; value: number }[]>>({})
  const selectLoading = ref<Record<string, boolean>>({})

  // #region DateTime logic

  const toISOValue = (value: number) => DateTime.fromMillis(value, { zone: 'utc' }).toISO()

  const getDateTimeExactValue = (columnCode: string): number | null => {
    const filterValue = infoDataTableStore.filters[columnCode]

    if (typeof filterValue === 'number') return filterValue
    if (typeof filterValue !== 'string' || !filterValue) return null

    const dateTime = DateTime.fromISO(filterValue, { zone: 'utc' })
    return dateTime.isValid ? dateTime.toMillis() : null
  }

  const getDateTimePeriodValue = (columnCode: string): [number, number] | null => {
    const filterValue = infoDataTableStore.filters[columnCode]
    if (!filterValue || typeof filterValue !== 'object') return null

    const periodValue = filterValue as IDateTimePeriodFilter
    if (!periodValue.from || !periodValue.to) return null

    const fromDateTime = DateTime.fromISO(periodValue.from, { zone: 'utc' })
    const toDateTime = DateTime.fromISO(periodValue.to, { zone: 'utc' })

    if (!fromDateTime.isValid || !toDateTime.isValid) return null

    return [fromDateTime.toMillis(), toDateTime.toMillis()]
  }

  const handleDateTimeExactChange = (
    columnCode: string,
    value: number | null,
    updateValue: () => void
  ) => {
    infoDataTableStore.filters[columnCode] = value === null ? '' : (toISOValue(value) ?? '')
    updateValue()
  }

  const handleDateTimePeriodChange = (
    columnCode: string,
    value: [number, number] | null,
    updateValue: () => void
  ) => {
    infoDataTableStore.filters[columnCode] = value
      ? {
          from: toISOValue(value[0]) ?? undefined,
          to: toISOValue(value[1]) ?? undefined,
        }
      : {}
    updateValue()
  }

  // #endregion

  const fetchSelectOptions = async (column: ITableColumn) => {
    if (!column.selectUrl || selectOptions.value[column.code]?.length) return

    selectLoading.value[column.code] = true

    const response = await api
      .get<{ result: { code: string; id: number }[] }>(column.selectUrl)
      .catch(() => null)

    if (response?.data.result) {
      selectOptions.value[column.code] = response.data.result.map(item => ({
        label: item.code,
        value: item.id,
      }))
    }

    selectLoading.value[column.code] = false
  }

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
