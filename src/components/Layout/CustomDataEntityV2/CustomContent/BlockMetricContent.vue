<template>
  <div class="block-header">
    <p class="block-header-title">{{ props.block.name }}</p>
  </div>
  <div class="block-content-thin">
    <!-- TODO BUG: Добавить потджерку boolean -->
    <n-data-table
      remote
      :loading="loadingRef"
      :data="tableData"
      :pagination="tablePagination"
      :pagination-behavior-on-filter="'first'"
      :columns="
        props.block.tableColumns.map(column => ({
          ...column,
          resizable: true,
        }))
      "
      :row-props="tableRowProps"
    />
  </div>
  <div class="block-actions" v-if="getBlockActions()">
    <button
      v-for="action in getBlockActions()"
      :key="action.code"
      class="action-btn"
      :class="`size-${action.size}`"
      @click="() => handleAction(action.code)"
    >
      {{ action.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { NDataTable, type PaginationProps } from 'naive-ui'
  import type { IBlockAction, IMetricBlock } from '@/src/utils/api/models/infoEntityV2.base'
  import { onMounted, reactive, ref, watch } from 'vue'
  import api from '@/src/utils/api'
  import { buildUrl } from '@/src/utils/buildUrl'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'
  import type { IMetricsTableList, ITableRow } from '@/src/utils/api/models/infoTableV2.base'
  import { useRouter } from 'vue-router'

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const router = useRouter()

  const props = defineProps<{
    block: IMetricBlock
    refreshTrigger?: number
  }>()

  const emit = defineEmits(['click:action'])

  const loadingRef = ref(true)

  const tableData = ref<ITableRow[]>([])
  const tablePagination = reactive<PaginationProps>({
    pageSize: 10,
    page: 1,
    pageCount: 0,
    itemCount: 0,
    defaultPage: 1,
    defaultPageSize: 10,
  })
  const tableRowProps = (row: ITableRow) => {
    return {
      style: !row?.deleted
        ? 'cursor: pointer;'
        : 'opacity: 0.4; text-decoration: line-through; cursor: pointer;',
      onClick: () => {
        router.push(
          `${infoDataEntityStore.initialData['id']}/${props.block.baseEntityUrl}/${row['id']}`
        )
      },
    }
  }

  const getBlockActions = (): IBlockAction[] | null => {
    if (!props.block.actions?.length) return null
    const blockActions = props.block.actions
    return blockActions.length ? blockActions : null
  }

  const fetchData = async () => {
    loadingRef.value = true
    const {
      data: { result },
    } = await api.post<{ result: IMetricsTableList<{ id: number }> }>(
      `${import.meta.env.VITE_API_BASE_URL_API}/${buildUrl(props.block.metricUrls.tableUrl, {
        parentId: infoDataEntityStore.initialData['id'],
      })}`
    )

    tableData.value = result.data
    tablePagination.page = result.page
    tablePagination.itemCount = result.total
    tablePagination.pageCount = result.maxPage

    loadingRef.value = false
  }

  const handleAction = async (action: string) => {
    if (action === 'new') {
      router.push(`${infoDataEntityStore.initialData['id']}/${props.block.baseEntityUrl}/create`)
    } else {
      emit('click:action', action)
    }
  }

  onMounted(() => {
    fetchData()
  })

  watch(
    () => props.refreshTrigger,
    (val, old) => {
      if (val !== undefined && val !== old) fetchData()
    }
  )
</script>

<style lang="scss">
  .loading-overlay {
    position: absolute;
    inset: 0;
    background: $color-surface-overlay;
    z-index: 9999;
  }
</style>
