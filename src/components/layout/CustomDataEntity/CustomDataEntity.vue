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
        <template v-if="!$slots[`block-${block.code}`]">
          <div
            v-for="detail in getBlockDetails(block.code)"
            :key="detail.title"
            class="detail-row"
          >
            <div class="detail-label">{{ detail.title }}</div>
            <div class="detail-value">
              <slot
                name="field"
                :field="detail"
                :value="getValueForField(detail)"
                :block="block"
              >
                {{ formatValue(getValueForField(detail)) }}
              </slot>
            </div>
          </div>
        </template>

        <slot
          v-else
          :name="`block-${block.code}`"
          :block="block"
          :fields="getBlockDetails(block.code)"
          :data="getDataForBlock(block.code)"
        />
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

// Helpers
const getBlockDetails = (blockCode: string) => {
  return (
    props.blockDetails.find(b => b.blockCode === blockCode)?.fields || []
  )
}

const getDataForBlock = (blockCode: string) => {
  return props.data.filter(item => item.blockCode === blockCode)
}

const getValueForField = (field: any) => {
  const blockData = getDataForBlock(field.blockCode)[0]
  if (!blockData) return null

  // Support dot notation (role.name → role?.name)
  return field.path.split('.').reduce((obj: any, key: string) => {
    return obj?.[key]
  }, blockData)
}

const formatValue = (value: any) => {
  if (value === null || value === undefined) return ''
  return String(value)
}
</script>

<style scoped>
.blocks {
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.block {
  margin-bottom: 32px;
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
  padding: 16px 24px;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #555;
}

.detail-value {
  color: #222;
}

@media (max-width: 600px) {
  .detail-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>