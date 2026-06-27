<template>
  <SelectionBlock :title="'Выбор стратегий'" :selection-style="true">
    <StrategyColumn
      v-for="strategy in selectedStrategies"
      :key="strategy.id"
      :strategy="strategy"
      @remove="removeStrategy"
    />

    <template #add-entity>
      <n-button
        :loading="strategiesDetailsLoading"
        :class="'content-add'"
        dashed
        @click="openStrategyModal"
      >
        +
      </n-button>
    </template>
  </SelectionBlock>

  <SelectListModal
    v-model:show="showStrategyModal"
    title="Выбрать стратегии"
    confirm-text="Добавить"
    empty-text="Список стратегий пуст"
    :fetch-items="loadStrategies"
    :initial-selected-ids="selectedStrategyIds"
    :close-on-confirm="false"
    @confirm="saveSelectedStrategies"
  />
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { NButton, useMessage } from 'naive-ui'
  import SelectListModal from '@/src/components/Ui/SelectListModal/SelectListModal.vue'
  import type { ISelectListItem } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import SelectionBlock from '@/src/views/marketing/strategies/CreateCompareStrategy/components/SelectionBlock.vue'
  import { useCompareStrategyV2Store } from '@/src/store/compareStrategyV2'
  import strategyApi from '@/src/utils/api/strategy'
  import StrategyColumn from '@/src/views/marketing/strategies/CreateCompareStrategy/components/StrategyColumn.vue'

  const message = useMessage()
  const compareStrategyV2Store = useCompareStrategyV2Store()
  const { selectedStrategies, strategiesDetailsLoading, reportConfiguration } =
    storeToRefs(compareStrategyV2Store)
  const { refreshSelectedStrategies, removeStrategy } = compareStrategyV2Store

  const showStrategyModal = ref(false)
  const selectedStrategyIds = computed(() => selectedStrategies.value.map(strategy => strategy.id))

  function loadStrategies() {
    return strategyApi.select()
  }

  function openStrategyModal() {
    if (selectedStrategies.value.length >= 4) {
      message.warning('Вы не можете выбрать больше 4 стратегий')
      return
    }

    showStrategyModal.value = true
  }

  async function saveSelectedStrategies(items: ISelectListItem[]) {
    if (items.length > 4) {
      message.warning('Вы не можете выбрать больше 4 стратегий')
      return
    }

    await refreshSelectedStrategies(items)
    showStrategyModal.value = false
  }

  onMounted(async () => {
    if (!selectedStrategies.value.length) return

    await refreshSelectedStrategies(selectedStrategies.value)
  })

  watch(
    reportConfiguration,
    async () => {
      if (!selectedStrategies.value.length) return

      await refreshSelectedStrategies(selectedStrategies.value)
    },
    { deep: true }
  )
</script>
