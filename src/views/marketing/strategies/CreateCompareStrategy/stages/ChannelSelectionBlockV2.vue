<template>
  <SelectionBlock :title="'Выбор каналов'" :selection-style="false">
    <ChannelColumn
      v-for="strategy in selectedStrategies"
      :key="strategy.id"
      :strategy="strategy"
      :channels="selectedChannels[String(strategy.id)] || []"
      @remove="channelId => removeChannel(strategy.id, channelId)"
    >
      <template #add-entity>
        <n-button
          :loading="channelsDetailsLoading"
          :class="'content-add'"
          dashed
          @click="() => openChannelModal(strategy)"
        >
          +
        </n-button>
      </template>
    </ChannelColumn>
  </SelectionBlock>

  <SelectListModal
    v-model:show="showChannelModal"
    title="Выбрать канала трафика"
    confirm-text="Добавить"
    empty-text="Список каналов пуст"
    :fetch-items="loadChannels"
    :initial-selected-ids="currentSelectedChannelIds"
    :close-on-confirm="false"
    @confirm="saveSelectedChannels"
    @cancel="resetCurrentStrategy"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { NButton, useMessage } from 'naive-ui'
  import SelectListModal from '@/src/components/Ui/SelectListModal/SelectListModal.vue'
  import type {
    ISelectListItem,
    SelectListItemId,
  } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import SelectionBlock from '@/src/views/marketing/strategies/CreateCompareStrategy/components/SelectionBlock.vue'
  import ChannelColumn from '@/src/views/marketing/strategies/CreateCompareStrategy/components/ChannelColumn.vue'
  import type { ICompareStrategy } from '@/src/views/marketing/strategies/CreateCompareStrategy/types'
  import { useCompareStrategyV2Store } from '@/src/store/compareStrategyV2'
  import channelApi from '@/src/utils/api/channel'

  const message = useMessage()
  const compareStrategyV2Store = useCompareStrategyV2Store()
  const { selectedStrategies, selectedChannels, channelsDetailsLoading } =
    storeToRefs(compareStrategyV2Store)
  const { setSelectedChannels, removeChannel } = compareStrategyV2Store

  const showChannelModal = ref(false)
  const currentStrategyId = ref<SelectListItemId | null>(null)

  const currentSelectedChannelIds = computed(() => {
    if (!currentStrategyId.value) return []

    return (selectedChannels.value[String(currentStrategyId.value)] || []).map(
      channel => channel.id
    )
  })

  function openChannelModal(strategy: ICompareStrategy) {
    const channels = selectedChannels.value[String(strategy.id)]

    if (channels && channels.length >= 4) {
      message.warning('Вы не можете выбрать больше 4 каналов')
      return
    }

    currentStrategyId.value = strategy.id
    showChannelModal.value = true
  }

  function loadChannels() {
    if (!currentStrategyId.value) throw new Error('Cannot fetch channels without strategy id')

    return channelApi.select({
      strategyId: Number(currentStrategyId.value),
    })
  }

  function saveSelectedChannels(items: ISelectListItem[]) {
    if (!currentStrategyId.value) throw new Error('Cannot save channels without strategy id')

    if (items.length > 4) {
      message.warning('Вы не можете выбрать больше 4 каналов')
      return
    }

    setSelectedChannels(currentStrategyId.value, items)
    resetCurrentStrategy()
    showChannelModal.value = false
  }

  function resetCurrentStrategy() {
    currentStrategyId.value = null
  }
</script>
