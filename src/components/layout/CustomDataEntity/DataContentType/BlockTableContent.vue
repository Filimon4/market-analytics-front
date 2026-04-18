<template>
  <div
    v-for="(column, colIndex) in getColumnsForBlock"
    :key="colIndex"
    class="column"
    :class="`column-${getColumnsForBlock.length}`"
  >
    <div v-for="entity in column" :key="entity.path" class="detail-row">
      <div class="detail-label">{{ entity.title }}</div>
      <div class="detail-value">
        <slot name="field" :field="entity" :block="block" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import type { IBlock } from '../CustomDataEntity.type'
  import { computed } from 'vue'

  const infoDataEntityStore = useInfoDataEntityStore()

  const props = defineProps<{
    block: IBlock
  }>()

  const getColumnsForBlock = computed(() => {
    return infoDataEntityStore.getColumnsForBlock(
      props.block.code,
      props.block.columnCapacity,
      props.block.maxColumns
    )
  })
</script>

<style scoped>
  .column {
    flex: 1;
    min-width: 260px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .column-1 .detail-row {
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 16px;
  }
  .column-2 .detail-row {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 14px;
  }
  .column-3 .detail-row {
    display: grid;
    grid-template-columns: 1fr 2.5fr;
    gap: 12px;
  }
  .column-4 .detail-row,
  .column-5 .detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .column-4 .detail-label,
  .column-5 .detail-label {
    font-size: 0.95em;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 12px;
    border-bottom: 1px solid #d1d1d1;
  }

  .detail-label {
    align-self: center;
    font-weight: 500;
    color: #555;
    padding: 5px;
    width: max-content;
  }

  .detail-value {
    align-self: center;
    color: #222;
  }

  @media (max-width: 900px) {
    .column {
      min-width: 100%;
    }
    .column .detail-row {
      grid-template-columns: 1fr 3fr !important;
      gap: 16px;
    }
  }
</style>
