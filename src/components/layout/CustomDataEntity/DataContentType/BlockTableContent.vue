<template>
  <div
    v-for="(column, colIndex) in getColumnsForBlock(block)"
    :key="colIndex"
    class="column"
    :class="`column-${getColumnsForBlock(block).length}`"
  >
    <div v-for="entity in column" :key="entity.path" class="detail-row">
      <div class="detail-label">{{ entity.title }}</div>
      <div class="detail-value">
        <slot name="field" :field="entity" :value="getValueForField(entity)" :block="block">
          {{ getValueForField(entity) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Data, IBlock, IField } from '../CustomDataEntity.type'

  const props = defineProps<{
    fields: IField[]
    data: Data
    block: IBlock
  }>()

  const getColumnsForBlock = (block: { columnCapacity: number; maxColumns: number }) => {
    const fields = props.fields
    if (!fields.length) return []

    const columns: Array<typeof fields> = []
    let currentColumn: typeof fields = []

    for (const field of fields) {
      if (currentColumn.length >= block.columnCapacity) {
        if (columns.length + 1 >= block.maxColumns) break
        columns.push(currentColumn)
        currentColumn = []
      }
      currentColumn.push(field)
    }

    if (currentColumn.length > 0) columns.push(currentColumn)
    return columns
  }

  const getValueForField = (field: IField) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return field.path.split('.').reduce((obj: any, key: string) => obj?.[key], props.data)
  }
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
