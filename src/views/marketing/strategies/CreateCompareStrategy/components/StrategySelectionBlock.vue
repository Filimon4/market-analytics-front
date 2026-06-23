<template>
  <div class="block">
    <Block title="Выбор стратегий" :actions="[]">
      <div class="block-content-thin strategies">
        <div class="strategies-content">
          <StrategyColumn
            v-for="strategy in strategies"
            :key="strategy.id"
            :strategy="strategy"
            @remove="emit('remove', $event)"
          />
        </div>

        <div class="add-strategy">
          <n-button
            type="primary"
            :loading="loading"
            @click="emit('add')"
            dashed
            style="width: 100%"
            >+</n-button
          >
        </div>
      </div>
      <template #actions>
        <div></div>
      </template>
    </Block>
  </div>
</template>

<script setup lang="ts">
  import { NButton } from 'naive-ui'
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'
  import type { SelectListItemId } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import type { ICompareStrategy } from '../types'
  import StrategyColumn from './StrategyColumn.vue'

  defineProps<{
    strategies: ICompareStrategy[]
    loading: boolean
  }>()

  const emit = defineEmits<{
    add: []
    remove: [strategyId: SelectListItemId]
  }>()
</script>

<style scoped lang="scss">
  .strategies {
    flex-direction: column !important;
    align-items: center;
    justify-content: end;
    gap: 10px;
  }

  .strategies-content {
    display: flex;
    flex-grow: 1;
    width: 100%;
    gap: 10px;
    border-radius: 10px;
  }

  .add-strategy {
    width: 80%;
    display: flex;
    align-items: flex-start;
  }
</style>
