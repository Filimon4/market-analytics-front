<template>
  <div class="blocks">
    <div v-for="block in blocks" :key="block.code" class="block">
      <slot
        name="block-header"
        :block="block"
        :title="block.name"
        :code="block.code"
      >
        <div class="block-header">
          <p>{{ block.name }}</p>
        </div>
      </slot>

      <div class="block-content">
        <div
          v-for="(column, colIndex) in getColumnsForBlock(block)"
          :key="colIndex"
          class="column"
          :class="`column-${getColumnsForBlock(block).length}`"
        >
          <div
            v-for="entity in column"
            :key="entity.path"
            class="detail-row"
          >
            <div class="detail-label">{{ entity.title }}</div>
            <div class="detail-value">
              <slot
                name="field"
                :field="entity"
                :value="getValueForField(entity)"
                :block="block"
              >
                {{ getValueForField(entity) }}
              </slot>
            </div>
          </div>
        </div>
      </div>

      <div class="block-actions" v-if="actions.filter(a => a.blockCode === block.code).length > 0">
        <button
          v-for="action in actions.filter(a => a.blockCode === block.code)"
          :key="action.code"
          class="action-btn"
          :class="`size-${action.size}`"
          @click="clickAction(action.code)"
        >
          {{ action.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Action, Block, BlockDetail, Row } from './CustomDataEntity.types';

const props = withDefaults(defineProps<{
  blocks: Block[]
  blockDetails: BlockDetail[]
  data: Row[]
  actions?: Action[]
}>(), {
  actions: () => []
})

const emit = defineEmits([
  'click:action'
])

const clickAction = (code: string) => {
  emit('click:action', code)
}

const getBlockDetails = (blockCode: string) => {
  return (
    props.blockDetails.find(b => b.blockCode === blockCode)?.fields || []
  )
}

const getValueForField = (field: any) => {
  const fieldData = field.path.split('.').reduce((obj: any, key: string) => {
    return obj?.[key]
  }, props.data)

  return fieldData
}

const getColumnsForBlock = (block: { code: string; columnCapacity: number; maxColumns: number }) => {
  const fields = getBlockDetails(block.code)
  if (!fields.length) return []

  const columns: Array<typeof fields> = []
  let currentColumn: typeof fields = []

  for (const field of fields) {
    if (currentColumn.length >= block.columnCapacity) {
      if (columns.length + 1 >= block.maxColumns) {
        break
      }
      columns.push(currentColumn)
      currentColumn = []
    }
    currentColumn.push(field)
  }

  if (currentColumn.length > 0) {
    columns.push(currentColumn)
  }

  return columns
}
</script>

<style scoped>
.blocks {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding: 24px;
}

.block {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.block-header {
  padding: 12px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.block-header p {
  margin: 0;
  font-size: 1.15em;
  color: #1a1a1a;
}

.block-content {
  display: flex;
  flex-direction: row;
  gap: 24px;
  padding: 16px 20px;
}

.column {
  flex: 1;
  min-width: 260px;           /* prevents columns from collapsing too much */
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Dynamic label-value ratio based on number of columns in the block */
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
.column-5 .detail-row {       /* 4+ columns → almost square ratio */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Optional: make label a bit narrower when many columns */
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
  font-weight: 500;
  color: #555;
}

.detail-value {
  color: #222;
}

/* Action buttons area */
.block-actions {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background: #f8fafc;
}

.action-btn {
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.12s;
}

.action-btn:hover {
  background: #f1f5f9;
}

/* Size variants */
.size-small  { padding: 0.35rem 0.75rem; font-size: 0.875rem; }
.size-medium { padding: 0.5rem 1rem;    font-size: 0.95rem;  }
.size-large  { padding: 0.65rem 1.35rem; font-size: 1.05rem; }

@media (max-width: 900px) {
  .block-content {
    flex-direction: column;
    gap: 28px;
  }

  .column {
    min-width: 100%;
  }

  .column .detail-row {
    grid-template-columns: 1fr 3fr !important;
    gap: 16px;
  }
}
</style>