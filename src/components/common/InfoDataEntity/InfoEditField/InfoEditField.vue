<template>
  <InfoInput v-if="field.type === 'string'" v-model:value="localValue" />

  <InfoInputNumber v-else-if="field.type === 'number'" v-model:value="localValue" />

  <InfoBooleanSelect v-else-if="field.type === 'boolean'" v-model:value="localValue" />

  <InfoSelect
    v-else-if="field.type === 'select'"
    v-model:value="localValue"
    :select-url="field.selectUrl || ''"
  />

  <InfoDatePicker v-else-if="field.type === 'datetime'" v-model:value="localValue" />

  <InfoFormula
    v-else-if="field.type === 'formula'"
    v-model:value="localValue"
    :formula-operators-url="field.formulaOperatorsUrl || ''"
  />

  <div class="actions">
    <n-button type="info" color="#2f9acc" @click="onSave" size="tiny">
      <template #icon>
        <n-icon>
          <img class="action-sprite" :src="acceptIcon" alt="accept" />
        </n-icon>
      </template>
    </n-button>
    <n-button type="info" color="#7c7c7cc0" @click="onCancel" size="tiny">
      <template #icon>
        <n-icon>
          <img class="action-sprite" :src="cancelIcon" alt="cancel" />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
  import acceptIcon from '/icons/accept.svg'
  import cancelIcon from '/icons/cancel.svg'
  import { DateTime } from 'luxon'
  import { onMounted, ref, watch } from 'vue'
  import InfoInput from './components/InfoInput.vue'
  import InfoInputNumber from './components/InfoInputNumber.vue'
  import InfoBooleanSelect from './components/InfoBooleanSelect.vue'
  import InfoSelect from './components/InfoSelect.vue'
  import InfoDatePicker from './components/InfoDatePicker.vue'
  import InfoFormula from './components/InfoFormula.vue'
  import type { IField } from '@/src/utils/api/models/infoEntityV2.base.ts'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2/index.ts'

  const props = withDefaults(defineProps<{ field: IField }>(), {})

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localValue = ref<any>(infoDataEntityStore.getValueOfField(props.field))

  const emits = defineEmits(['exist-editing'])

  const onSave = () => {
    if (
      props.field.type === 'select' &&
      typeof localValue.value === 'object' &&
      localValue.value !== null
    ) {
      const selectValue = localValue.value as { id: number; code: string }

      infoDataEntityStore.updateFieldValue(props.field.editPath || props.field.path, selectValue)
    } else if (props.field.type === 'formula' && Array.isArray(localValue.value)) {
      infoDataEntityStore.updateFieldValue(
        props.field.editPath || props.field.path,
        localValue.value
      )
    } else if (props.field.type === 'datetime' && typeof localValue.value === 'number') {
      const valueToSave = DateTime.fromMillis(localValue.value, { zone: 'utc' }).toISO()

      infoDataEntityStore.updateFieldValue(props.field.editPath || props.field.path, valueToSave)
    } else {
      infoDataEntityStore.updateFieldValue(
        props.field.editPath || props.field.path,
        localValue.value
      )
    }
    emits('exist-editing')
    return
  }

  const onCancel = () => {
    infoDataEntityStore.resetFieldValue(props.field)
    emits('exist-editing')
  }

  onMounted(() => {
    if (props.field.type === 'datetime' && typeof localValue.value === 'string') {
      const dateTime = DateTime.fromISO(localValue.value, { zone: 'utc' })
      localValue.value = dateTime.isValid ? dateTime.toMillis() : null
    }
  })

  watch(
    () => infoDataEntityStore.getCancelationToken(),
    () => {
      onCancel()
    }
  )
</script>

<style>
  .actions {
    display: flex;
    gap: 6px;
  }

  .action-sprite {
    height: 15px;
    width: 15px;
  }
</style>
