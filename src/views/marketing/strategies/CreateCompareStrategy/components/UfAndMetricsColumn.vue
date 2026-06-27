<template>
  <div :class="'column'">
    <n-collapse :class="'entities'">
      <n-collapse-item v-for="channel of channels" :class="'entity'" :key="channel.id">
        <!-- #region header -->
        <template #header="{ collapsed }">
          <div class="channel-header">
            <div class="header-title">
              {{ channel.code }}
            </div>
            <template v-if="collapsed">
              <div class="header-tags">
                <n-tag
                  v-for="metric in getSelectedEntities(channel.id, 'metric')"
                  size="tiny"
                  :key="`metric-${metric.id}`"
                  :color="{ color: '#27F5B0', textColor: '#000', borderColor: '#000' }"
                >
                  {{ metric.name }}
                </n-tag>
              </div>
              <div class="header-tags">
                <n-tag
                  v-for="uf in getSelectedEntities(channel.id, 'uf')"
                  size="tiny"
                  :key="`uf-${uf.id}`"
                  :class="'header-tags'"
                  :color="{ color: '#FFB269', textColor: '#000', borderColor: '#000' }"
                >
                  {{ uf.name }}
                </n-tag>
              </div>
            </template>
          </div>
        </template>
        <!-- #endregion -->

        <template #default>
          <n-tree-select
            :class="'channel-tree'"
            multiple
            cascade
            checkable
            :options="getTreeOptions(channel.id)"
            :value="getSelectedKeys(channel.id)"
            :loading="loadingChannelIds.includes(String(channel.id))"
            @update:value="value => handleUpdateValue(channel.id, value)"
          />
        </template>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
  import { NTag, NCollapse, NCollapseItem, NTreeSelect, type TreeSelectOption } from 'naive-ui'
  import type { ICompareChannale } from '@/src/views/marketing/strategies/CreateCompareStrategy/types'
  import type { SelectListItemId } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import { ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import channelApi from '@/src/utils/api/channel'
  import {
    useCompareStrategyV2Store,
    type CompareMetricEntityKey,
    type CompareMetricEntityType,
  } from '@/src/store/compareStrategyV2'

  const props = defineProps<{
    channels: ICompareChannale[]
  }>()

  type ChannelMetricEntities = Awaited<ReturnType<typeof channelApi.getMetricEntities>>
  type MetricEntity = ChannelMetricEntities['metric'][number]

  const compareStrategyV2Store = useCompareStrategyV2Store()
  const { selectedMetricEntities } = storeToRefs(compareStrategyV2Store)
  const { setSelectedMetricEntityKeys } = compareStrategyV2Store

  const metrics = ref<Record<string, ChannelMetricEntities>>({})
  const loadingChannelIds = ref<string[]>([])

  watch(
    () => props.channels.map(channel => String(channel.id)),
    async channelIds => {
      const uniqueChannelIds = [...new Set(channelIds)]
      metrics.value = Object.fromEntries(
        Object.entries(metrics.value).filter(([channelId]) => uniqueChannelIds.includes(channelId))
      )

      await Promise.all(uniqueChannelIds.map(loadChannelMetricEntities))
    },
    { immediate: true }
  )

  async function loadChannelMetricEntities(channelId: string) {
    if (metrics.value[channelId] || loadingChannelIds.value.includes(channelId)) return

    loadingChannelIds.value = [...loadingChannelIds.value, channelId]

    try {
      const channelEntities = await channelApi.getMetricEntities(channelId)
      metrics.value = {
        ...metrics.value,
        [channelId]: channelEntities,
      }
    } finally {
      loadingChannelIds.value = loadingChannelIds.value.filter(id => id !== channelId)
    }
  }

  function getTreeOptions(channelId: SelectListItemId): TreeSelectOption[] {
    const channelEntities = metrics.value[String(channelId)]
    if (!channelEntities) return []

    return [
      {
        key: `metric-group-${channelId}`,
        label: 'Метрики',
        children: channelEntities.metric.map(metric => ({
          key: getEntityKey('metric', metric.id),
          label: metric.name,
        })),
      },
      {
        key: `uf-group-${channelId}`,
        label: 'Свойства',
        children: channelEntities.uf.map(uf => ({
          key: getEntityKey('uf', uf.id),
          label: uf.name,
        })),
      },
    ]
  }

  function getSelectedKeys(channelId: SelectListItemId): CompareMetricEntityKey[] {
    const selectedEntities = selectedMetricEntities.value[String(channelId)]
    if (!selectedEntities) return []

    return [
      ...selectedEntities.metricIds.map(id => getEntityKey('metric', id)),
      ...selectedEntities.ufIds.map(id => getEntityKey('uf', id)),
    ]
  }

  function getSelectedEntities(
    channelId: SelectListItemId,
    type: CompareMetricEntityType
  ): MetricEntity[] {
    const channelEntities = metrics.value[String(channelId)]
    const selectedEntities = selectedMetricEntities.value[String(channelId)]
    if (!channelEntities || !selectedEntities) return []

    const selectedIds = new Set(
      type === 'metric' ? selectedEntities.metricIds : selectedEntities.ufIds
    )

    return channelEntities[type].filter(entity => selectedIds.has(String(entity.id)))
  }

  function getEntityKey(
    type: CompareMetricEntityType,
    id: SelectListItemId
  ): CompareMetricEntityKey {
    return `${type}:${String(id)}`
  }

  function isMetricEntityKey(value: string): value is CompareMetricEntityKey {
    return value.startsWith('metric:') || value.startsWith('uf:')
  }

  const handleUpdateValue = (
    channelId: SelectListItemId,
    value: string | number | Array<string | number> | null
  ) => {
    const keys = Array.isArray(value)
      ? value.filter((key): key is CompareMetricEntityKey => {
          return typeof key === 'string' && isMetricEntityKey(key)
        })
      : []

    setSelectedMetricEntityKeys(channelId, keys)
  }
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    max-width: 400px;
    padding: 10px;
    @include custom-data-entities-v2-block-borders();
  }

  .entities {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .entity {
    padding: 5px;
    width: 100%;
    height: 100%;
    @include custom-data-entities-v2-block-borders();
  }

  .channel-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: start;
  }

  .header-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }

  .channel-tree {
    width: 100%;
  }
</style>
