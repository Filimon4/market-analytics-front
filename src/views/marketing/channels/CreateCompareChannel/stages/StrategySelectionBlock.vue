<template>
  <SelectionBlock :title="'Выбор стратегии'" :selection-style="true">
    <StrategyColumn v-if="selectedStrategy" :strategy="selectedStrategy" @remove="removeStrategy" />

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
    :selection-mode="'single'"
    @confirm="saveSelectedStrategies"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { NButton } from 'naive-ui'
  import SelectListModal from '@/src/components/Ui/SelectListModal/SelectListModal.vue'
  import SelectionBlock from '@/src/views/marketing/strategies/CreateCompareStrategy/components/SelectionBlock.vue'
  import strategyApi from '@/src/utils/api/strategy'
  import { useCompareChannelStore } from '@/src/store/compareChannel'
  import type { ICompareStrategy } from '@/src/views/marketing/channels/CreateCompareChannel/types'
  import StrategyColumn from '@/src/views/marketing/channels/CreateCompareChannel/components/StrategyColumn.vue'

  const strategiesDetailsLoading = ref<boolean>(false)
  const compareChannelStore = useCompareChannelStore()
  const { selectedStrategy } = storeToRefs(compareChannelStore)
  const { removeStrategy, setSelectedStrategy } = compareChannelStore

  const showStrategyModal = ref(false)
  const selectedStrategyIds = computed(() =>
    selectedStrategy.value?.id ? [selectedStrategy.value?.id] : []
  )

  function loadStrategies() {
    return strategyApi.select()
  }

  function openStrategyModal() {
    showStrategyModal.value = true
  }

  async function saveSelectedStrategies(items: ICompareStrategy[]) {
    setSelectedStrategy(items[0] || null)

    showStrategyModal.value = false
  }

  // watch(
  //   reportConfiguration,
  //   async () => {
  //     if (!selectedStrategy.value) return

  //     await refreshSelectedStrategies(selectedStrategy.value)
  //   },
  //   { deep: true }
  // )
</script>
