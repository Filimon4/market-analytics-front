<template>
  <CustomDataTable
    v-model:filters="infoDataTableStore.filters"
    :columns="infoDataTableStore.getColumns()"
    :data="infoDataTableStore.getTableData()"
    :actions="actions"
    :loading="pageLoading"
    :maxPage="infoDataTableStore.getMaxPage()"
    :pageSize="infoDataTableStore.getPageSize()"
    :page="infoDataTableStore.getPage()"
    :total="infoDataTableStore.getTotal()"
    @click:entity="handleClickEntity"
    @click:action="code => emit('click:action', code)"
    @change:page:next="() => {}"
    @change:page:reset="() => {}"
    @change:page:size="(newSize: number) => {}"
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

    <!-- TODO: Поправить -->
    <!-- <template #row="{ row, col }">
      <InfoField
        :value="col?.path ? getValueForField(col.path, row) : row[col.code]"
        :type="col.type"
      />
    </template> -->
  </CustomDataTable>
</template>

<script setup lang="ts">
  import { onMounted, ref, type PropType } from 'vue'
  import CustomDataTable from '../CustomDataTable/CustomDataTable.vue'
  import { useRouter } from 'vue-router'
  import { useInfoDataTableStore } from '@/src/store/infoDataTable.ts'
  import type { ITableList, ITableRow } from '@/src/utils/api/models/infoTable.base'
  import type { Action } from '../CustomDataTable/CustomDataTable.type'
  // import InfoField from '../../common/InfoDataEntity/InfoField/InfoField.vue'

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
</style>
