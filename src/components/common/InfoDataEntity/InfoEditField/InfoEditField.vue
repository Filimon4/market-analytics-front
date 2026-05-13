<template>
  <InfoInput
    v-if="props.type === 'string' && typeof localValue === 'string'"
    v-model:value="localValue"
  />

  <InfoInputNumber
    v-else-if="props.type === 'number' && typeof localValue === 'number'"
    v-model:value="localValue"
  />

  <InfoBooleanSelect
    v-else-if="
      props.type === 'boolean' &&
      typeof localValue === 'number' &&
      (localValue === 1 || localValue === 0)
    "
    v-model:value="localValue"
  />

  <InfoSelect
    v-else-if="
      props.type === 'select' && (typeof localValue === 'string' || typeof localValue === 'number')
    "
    v-model:value="localValue"
    :select-url="props.selectUrl"
  />

  <n-date-picker
    v-else-if="props.type === 'datetime'"
    :value="dateTimeValue"
    type="datetime"
    clearable
    @update:value="handleDateTimeUpdate"
  />

  <div class="actions">
    <n-button type="info" color="#2f9acc" @click="emits('save')" size="tiny">
      <template #icon>
        <n-icon>
          <img class="action-sprite" :src="acceptIcon" alt="accept" />
        </n-icon>
      </template>
    </n-button>
    <n-button type="info" color="#7c7c7cc0" @click="emits('cancel')" size="tiny">
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
  import type { IField } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import { onMounted, ref, watch } from 'vue'
  import { NDatePicker } from 'naive-ui'
  import InfoInput from './components/InfoInput.vue'
  import InfoInputNumber from './components/InfoInputNumber.vue'
  import InfoBooleanSelect from './components/InfoBooleanSelect.vue'
  import InfoSelect from './components/InfoSelect.vue'

  const emits = defineEmits(['save', 'cancel'])

  const localValue = defineModel<number | string | Record<string, unknown> | null>('value', {
    required: true,
  })

  const props = withDefaults(defineProps<Partial<Pick<IField, 'selectUrl' | 'type'>>>(), {
    type: 'string',
    selectUrl: '',
  })

  const dateTimeValue = ref<number | null>(null)

  const syncDateTimeValueFromModel = () => {
    if (props.type !== 'datetime') return

    if (typeof localValue.value === 'number') {
      dateTimeValue.value = Number.isFinite(localValue.value) ? localValue.value : null
      return
    }

    if (typeof localValue.value === 'string' && localValue.value) {
      const parsed = Date.parse(localValue.value)
      dateTimeValue.value = Number.isNaN(parsed) ? null : parsed
      return
    }

    dateTimeValue.value = null
  }

  const handleDateTimeUpdate = (newValue: number | null) => {
    dateTimeValue.value = newValue
    localValue.value = (
      newValue === null ? null : new Date(newValue).toISOString()
    ) as typeof localValue.value
  }

  watch(
    () => localValue.value,
    () => {
      syncDateTimeValueFromModel()
    },
    { deep: true }
  )

  onMounted(() => {
    if (props.type === 'datetime') {
      syncDateTimeValueFromModel()
    }
  })
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
