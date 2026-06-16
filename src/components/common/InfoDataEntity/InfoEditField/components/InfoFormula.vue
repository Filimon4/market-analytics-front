<template>
  <div class="info-formula">
    <div v-if="localValue && localValue.length > 0" class="info-formula__tags">
      <div
        v-for="(op, index) in localValue"
        :key="index"
        draggable="true"
        :class="['info-formula__tag-wrap', { 'is-drag-over': dragOverIndex === index }]"
        @dragstart="onDragStart(index)"
        @dragover.prevent="onDragOver(index)"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop(index)"
      >
        <n-tag
          size="small"
          closable
          :color="op.color ? { textColor: op.color } : undefined"
          @close="removeAt(index)"
        >
          {{ op.label }}
        </n-tag>
      </div>
    </div>
    <div class="info-formula__number-row">
      <n-input-number
        v-model:value="numberInput"
        size="small"
        :placeholder="'Произвольное число'"
        :show-button="false"
        @keydown.enter="addNumber"
      />
      <n-button size="small" @click="addNumber" :disabled="numberInput === null">+</n-button>
    </div>
    <n-select
      :value="null"
      filterable
      size="small"
      :placeholder="'Добавить'"
      :loading="loading"
      :options="groupedOptions"
      @update:value="addOperator"
    />
  </div>
</template>

<script setup lang="ts">
  import { NSelect, NTag, NInputNumber, NButton } from 'naive-ui'
  import type { SelectGroupOption, SelectOption } from 'naive-ui'
  import { onMounted, ref } from 'vue'
  import api from '@/src/utils/api'
  import { buildUrl } from '@/src/utils/buildUrl'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'

  interface FormulaOperator {
    label: number
    value: string
    color?: string
  }

  interface FormulaOperatorGroup {
    label: string
    key: string
    color: string
    children: FormulaOperator[]
  }

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const localValue = defineModel<{ label: number; value: string; color?: string }[]>('value', {
    required: true,
  })

  const props = defineProps<{
    formulaOperatorsUrl: string
  }>()

  const loading = ref(false)
  const numberInput = ref<number | null>(null)

  // #region drag logic
  const dragFromIndex = ref<number | null>(null)
  const dragOverIndex = ref<number | null>(null)

  const onDragStart = (index: number) => {
    dragFromIndex.value = index
  }

  const onDragOver = (index: number) => {
    if (dragFromIndex.value === null || dragFromIndex.value === index) return
    dragOverIndex.value = index
  }

  const onDragLeave = () => {
    dragOverIndex.value = null
  }

  const onDrop = (toIndex: number) => {
    dragOverIndex.value = null
    if (dragFromIndex.value === null || dragFromIndex.value === toIndex) {
      dragFromIndex.value = null
      return
    }
    const arr = [...localValue.value]
    const [item] = arr.splice(dragFromIndex.value, 1) as [
      { label: number; value: string; color?: string },
    ]
    arr.splice(toIndex, 0, item)
    localValue.value = arr
    dragFromIndex.value = null
  }
  //   #endregion

  const addNumber = () => {
    if (numberInput.value === null) return
    localValue.value = [
      ...(localValue.value ?? []),
      { label: numberInput.value, value: `uf-number-${numberInput.value}`, color: '#FF4D85' },
    ]
    numberInput.value = null
  }
  const groupedOptions = ref<Array<SelectOption | SelectGroupOption>>([])
  const allOperators = ref<FormulaOperator[]>([])

  const addOperator = (val: string) => {
    const op = allOperators.value.find((o: FormulaOperator) => o.value === val)
    if (!op) return
    localValue.value = [
      ...(localValue.value ?? []),
      { label: op.label, value: op.value, color: op.color },
    ]
  }

  const removeAt = (index: number) => {
    localValue.value = localValue.value.filter((_, i) => i !== index)
  }

  const fetchOperators = async () => {
    if (!props.formulaOperatorsUrl) {
      groupedOptions.value = []
      return
    }

    loading.value = true

    const response = await api
      .get<{ result: FormulaOperatorGroup[] }>(
        `${import.meta.env.VITE_API_BASE_URL_API}/${buildUrl(props.formulaOperatorsUrl, {
          parentId: infoDataEntityStore.initialData['id'],
        })}`
      )
      .catch(() => null)

    loading.value = false

    if (!response?.data.result) return

    allOperators.value = response.data.result.flatMap(group =>
      group.children.map(child => ({ ...child, color: group.color }))
    )

    groupedOptions.value = response.data.result.map(group => ({
      type: 'group' as const,
      label: group.label,
      key: group.key,
      children: group.children,
    }))
  }

  onMounted(async () => {
    await fetchOperators()

    if (!localValue.value) {
      localValue.value = []
    }
  })
</script>

<style scoped>
  .info-formula {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-formula__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  /* #region draw css */
  .info-formula__tag-wrap {
    cursor: grab;
  }

  .info-formula__tag-wrap:active {
    cursor: grabbing;
  }

  .info-formula__tag-wrap.is-drag-over {
    outline: 2px solid #2f9acc;
    border-radius: 4px;
  }
  /* #endregion */

  .info-formula__number-row {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .info-formula__number-row .n-input-number {
    flex: 1;
  }
</style>
