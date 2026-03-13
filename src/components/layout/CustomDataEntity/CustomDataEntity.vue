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
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  blocks: Array<{
    name: string
    code: string
    columnCapacity: number
    maxColumns: number
  }>
  blockDetails: Array<{
    fields: Array<{
      title: string
      path: string
      editable: boolean
      type: string
      editPath?: string
    }>
    blockCode: string
  }>
  data: Array<Record<string, any> & { blockCode: string }>
}>()

const getBlockDetails = (blockCode: string) => {
  return (
    props.blockDetails.find(b => b.blockCode === blockCode)?.fields || []
  )
}

const getValueForField = (field: any) => {
  const fieldData = field.path.split('.').reduce((obj: any, key: string) => {
    console.log(key)
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