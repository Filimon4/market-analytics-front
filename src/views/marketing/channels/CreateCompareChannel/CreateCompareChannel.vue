<template>
  <div class="entity-wrapper">
    <StageBuilder
      v-model:current-stage="currentStage"
      :stages="stages"
      :show-progress="false"
      :disable-next="reportCreating"
      @finish="handleFinish"
    >
      <template #channels>
        <div class="channel-stage">
          <div class="block">
            <Block title="Стратегия">
              <div class="block-content-thin strategy-selection">
                <div v-if="selectedStrategy" class="selected-entity">
                  <div>
                    {{ selectedStrategy.code }}
                  </div>
                  <n-button size="small" tertiary type="error" @click="setSelectedStrategy(null)">
                    X
                  </n-button>
                </div>
              </div>
              <template #actions>
                <n-button dashed class="content-add" @click="openStrategyModal">
                  {{ selectedStrategy ? 'Изменить стратегию' : 'Выбрать стратегию' }}
                </n-button>
              </template>
            </Block>
          </div>

          <SelectionBlock title="Выбор каналов" :selection-style="true">
            <div v-for="channel in selectedChannels" :key="channel.id" class="selected-entity">
              <div>
                {{ channel.code }}
              </div>
              <n-button size="small" tertiary type="error" @click="removeChannel(channel.id)">
                X
              </n-button>
            </div>

            <template #add-entity>
              <n-button
                dashed
                class="content-add"
                :disabled="!selectedStrategy"
                @click="openChannelModal"
              >
                +
              </n-button>
            </template>
          </SelectionBlock>
        </div>
      </template>

      <template #metrics>
        <SelectionBlock title="Сравнение по свойствам и метрикам" :selection-style="false">
          <div v-for="channel in selectedChannels" :key="channel.id" class="metric-column">
            <n-collapse class="entities">
              <n-collapse-item class="entity" :name="String(channel.id)">
                <template #header="{ collapsed }">
                  <div class="channel-header">
                    <div class="header-title">
                      {{ channel.code }}
                    </div>
                    <template v-if="collapsed">
                      <div class="header-tags">
                        <n-tag
                          v-for="metric in getSelectedEntities(channel.id, 'metric')"
                          :key="`metric-${metric.id}`"
                          size="tiny"
                          :color="{ color: '#27F5B0', textColor: '#000', borderColor: '#000' }"
                        >
                          {{ metric.name }}
                        </n-tag>
                      </div>
                      <div class="header-tags">
                        <n-tag
                          v-for="uf in getSelectedEntities(channel.id, 'uf')"
                          :key="`uf-${uf.id}`"
                          size="tiny"
                          :color="{ color: '#FFB269', textColor: '#000', borderColor: '#000' }"
                        >
                          {{ uf.name }}
                        </n-tag>
                      </div>
                    </template>
                  </div>
                </template>

                <n-tree-select
                  class="channel-tree"
                  multiple
                  cascade
                  checkable
                  :options="getTreeOptions(channel.id)"
                  :value="getSelectedKeys(channel.id)"
                  :loading="loadingChannelIds.includes(String(channel.id))"
                  @update:value="value => handleUpdateValue(channel.id, value)"
                />
              </n-collapse-item>
            </n-collapse>
          </div>
        </SelectionBlock>
      </template>
    </StageBuilder>
  </div>

  <SelectListModal
    v-model:show="showStrategyModal"
    title="Выбрать стратегию"
    confirm-text="Добавить"
    empty-text="Список стратегий пуст"
    selection-mode="single"
    :fetch-items="loadStrategies"
    :initial-selected-ids="selectedStrategyIds"
    :close-on-confirm="false"
    @confirm="saveSelectedStrategy"
  />

  <SelectListModal
    v-model:show="showChannelModal"
    title="Выбрать каналы трафика"
    confirm-text="Добавить"
    empty-text="Список каналов пуст"
    :fetch-items="loadChannels"
    :initial-selected-ids="selectedChannelIds"
    :close-on-confirm="false"
    @confirm="saveSelectedChannels"
  />
</template>

<script setup lang="ts">
  import { computed, onUnmounted, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import {
    NButton,
    NCollapse,
    NCollapseItem,
    NTag,
    NTreeSelect,
    useMessage,
    type TreeSelectOption,
  } from 'naive-ui'
  import { useRouter } from 'vue-router'
  import StageBuilder from '@/src/components/Layout/StageBuilder/StageBuilder.vue'
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'
  import SelectListModal from '@/src/components/Ui/SelectListModal/SelectListModal.vue'
  import type {
    ISelectListItem,
    SelectListItemId,
  } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import {
    useCompareChannelStore,
    type CompareChannelMetricEntityKey,
    type CompareChannelMetricEntityType,
  } from '@/src/store/compareChannel'
  import SelectionBlock from '@/src/views/marketing/strategies/CreateCompareStrategy/components/SelectionBlock.vue'
  import strategyApi from '@/src/utils/api/strategy'
  import channelApi from '@/src/utils/api/channel'

  type ChannelMetricEntities = Awaited<ReturnType<typeof channelApi.getMetricEntities>>
  type MetricEntity = ChannelMetricEntities['metric'][number]

  const message = useMessage()
  const router = useRouter()
  const compareChannelStore = useCompareChannelStore()
  const {
    currentStage,
    stages,
    maxColumns,
    selectedStrategy,
    selectedChannels,
    selectedMetricEntities,
    reportCreating,
  } = storeToRefs(compareChannelStore)
  const {
    setSelectedStrategy,
    setSelectedChannels,
    removeChannel,
    setSelectedMetricEntityKeys,
    createReport,
    reset,
  } = compareChannelStore

  const showStrategyModal = ref(false)
  const showChannelModal = ref(false)
  const metrics = ref<Record<string, ChannelMetricEntities>>({})
  const loadingChannelIds = ref<string[]>([])

  const selectedStrategyIds = computed(() =>
    selectedStrategy.value ? [selectedStrategy.value.id] : []
  )
  const selectedChannelIds = computed(() => selectedChannels.value.map(channel => channel.id))

  watch(
    () => selectedChannels.value.map(channel => String(channel.id)),
    async channelIds => {
      const uniqueChannelIds = [...new Set(channelIds)]
      metrics.value = Object.fromEntries(
        Object.entries(metrics.value).filter(([channelId]) => uniqueChannelIds.includes(channelId))
      )

      await Promise.all(uniqueChannelIds.map(loadChannelMetricEntities))
    },
    { immediate: true }
  )

  function openStrategyModal() {
    showStrategyModal.value = true
  }

  function openChannelModal() {
    if (!selectedStrategy.value) {
      message.warning('Сначала выберите стратегию')
      return
    }

    showChannelModal.value = true
  }

  function loadStrategies() {
    return strategyApi.select()
  }

  function loadChannels() {
    if (!selectedStrategy.value) throw new Error('Cannot fetch channels without strategy id')

    return channelApi.select({
      strategyId: Number(selectedStrategy.value.id),
    })
  }

  function saveSelectedStrategy(items: ISelectListItem[]) {
    setSelectedStrategy(items[0] || null)
    showStrategyModal.value = false
  }

  function saveSelectedChannels(items: ISelectListItem[]) {
    if (items.length < 2) {
      message.warning('Выберите минимум 2 канала')
      return
    }

    setSelectedChannels(items)
    showChannelModal.value = false
  }

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

  function getSelectedKeys(channelId: SelectListItemId): CompareChannelMetricEntityKey[] {
    const selectedEntities = selectedMetricEntities.value[String(channelId)]
    if (!selectedEntities) return []

    return [
      ...selectedEntities.metricIds.map(id => getEntityKey('metric', id)),
      ...selectedEntities.ufIds.map(id => getEntityKey('uf', id)),
    ]
  }

  function getSelectedEntities(
    channelId: SelectListItemId,
    type: CompareChannelMetricEntityType
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
    type: CompareChannelMetricEntityType,
    id: SelectListItemId
  ): CompareChannelMetricEntityKey {
    return `${type}:${String(id)}`
  }

  function isMetricEntityKey(value: string): value is CompareChannelMetricEntityKey {
    return value.startsWith('metric:') || value.startsWith('uf:')
  }

  function handleUpdateValue(
    channelId: SelectListItemId,
    value: string | number | Array<string | number> | null
  ) {
    const keys = Array.isArray(value)
      ? value.filter((key): key is CompareChannelMetricEntityKey => {
          return typeof key === 'string' && isMetricEntityKey(key)
        })
      : []

    setSelectedMetricEntityKeys(channelId, keys)
  }

  async function handleFinish() {
    try {
      await createReport()
      message.success('Отчёт успешно создан')
      await router.push({
        path: '/marketing/analytics',
      })
    } catch {
      message.error('Не удалось создать отчёт')
    }
  }

  onUnmounted(() => {
    reset()
  })
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  @include custom-data-entity-v2-children;
  @include custom-data-entities-v2-blocks;

  .entity-wrapper {
    width: 100%;
    position: relative;
    padding: 10px;
  }

  .channel-stage {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .strategy-selection {
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .selected-entity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    min-height: 40px;
    padding: 6px 10px;
    @include custom-data-entities-v2-block-borders();
  }

  .metric-column {
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

  :deep(.block-content-selection) {
    flex-direction: column !important;
    align-items: center;
    justify-content: end;
    gap: 10px;
  }

  :deep(.content-columns) {
    display: grid;
    grid-template-columns: repeat(v-bind('maxColumns'), 1fr);
    grid-template-rows: 1fr;
    width: 100%;
  }

  :deep(.content-add) {
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
