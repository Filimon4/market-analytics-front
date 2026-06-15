<template>
  <div class="info-formula">
    <div v-if="localValue && localValue.length > 0" class="info-formula__tags">
      <n-tag
        v-for="(op, index) in localValue"
        :key="index"
        size="small"
        closable
        @close="removeAt(index)"
      >
        {{ op.label }}
      </n-tag>
    </div>
    <n-select
      :value="null"
      filterable
      size="small"
      :placeholder="'Add operator...'"
      :loading="loading"
      :options="groupedOptions"
      @update:value="addOperator"
    />
  </div>
</template>

<script setup lang="ts">
  import { NSelect, NTag } from 'naive-ui'
  import type { SelectGroupOption, SelectOption } from 'naive-ui'
  import { onMounted, ref } from 'vue'
  import api from '@/src/utils/api'
  import { buildUrl } from '@/src/utils/buildUrl'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'

  interface FormulaOperator {
    label: number
    value: string
  }

  interface FormulaOperatorGroup {
    label: string
    key: string
    children: FormulaOperator[]
  }

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const localValue = defineModel<{ label: number; value: string }[]>('value', {
    required: true,
  })

  const props = defineProps<{
    formulaOperatorsUrl: string
  }>()

  const loading = ref(false)
  const groupedOptions = ref<Array<SelectOption | SelectGroupOption>>([])
  const allOperators = ref<FormulaOperator[]>([])

  const addOperator = (val: string) => {
    const op = allOperators.value.find((o: FormulaOperator) => o.value === val)
    if (!op) return
    localValue.value = [...(localValue.value ?? []), { label: op.label, value: op.value }]
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

    allOperators.value = response.data.result.flatMap(group => group.children)

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
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-formula__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
</style>
