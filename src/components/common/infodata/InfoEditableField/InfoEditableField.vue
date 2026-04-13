<template>
  <div
    :class="{
      disabled: isDisabled,
    }"
  >
    <div v-if="!isEditing" class="view-mode">
      <InfoField
        :value="displayValue"
        :type="field.type"
        :editable="canEdit"
        :disabled="isDisabled"
        @click:edit="toggleEdit"
      />
    </div>

    <div v-else class="edit-mode">
      <InfoEditField :type="field.type" :select-url="field.selectUrl" v-model:value="localValue" />

      <div class="actions">
        <n-button type="info" color="#2f9acc" @click="save" size="tiny">
          <template #icon>
            <n-icon>
              <img class="action-sprite" :src="acceptIcon" alt="accept" />
            </n-icon>
          </template>
        </n-button>
        <n-button type="info" color="#7c7c7cc0" @click="cancel" size="tiny">
          <template #icon>
            <n-icon>
              <img class="action-sprite" :src="cancelIcon" alt="cancel" />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { DateTime } from 'luxon'
  import type { IField, Data } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
  import acceptIcon from '/icons/accept.svg'
  import cancelIcon from '/icons/cancel.svg'
  import InfoField from '@/src/components/common/infodata/infoField/InfoField.vue'
  import InfoEditField from '@/src/components/common/infodata/infoEditField/InfoEditField.vue'

  const props = defineProps<{
    field: IField
    value: Data[string]
  }>()

  const emit = defineEmits<{
    (e: 'update', payload: { field: IField; value: Data[string] }): void
  }>()

  const isEditing = ref(false)
  const localValue = ref<number | string | boolean>(
    (props.value as number | string | boolean) ?? ''
  )

  const canEdit = computed(() => {
    if (props.field?.createEditable) {
      return props.field?.createEditable
    }

    return props.field?.editable
  })
  const isDisabled = computed(() => props.field?.editable === false && !props.field?.createEditable)

  const displayValue = computed(() => {
    const v: Data[string] = localValue.value
    if (v == null) return ''

    const type = props.field?.type

    if (type === 'datetime') {
      return DateTime.fromISO(v as string, { zone: 'utc' })
        .setLocale('ru')
        .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
        .replace(' г.,', ' г.')
    }
    if (type === 'boolean') {
      return v ? 'Да' : 'Нет'
    }
    return v
  })

  function toggleEdit() {
    if (!canEdit.value || isDisabled.value) return
    isEditing.value = !isEditing.value
  }

  function save() {
    emit('update', { field: props.field, value: localValue.value })
    isEditing.value = false
  }

  function cancel() {
    localValue.value = (props.value as number | string | boolean) ?? ''
    isEditing.value = false
  }

  defineExpose({ save, cancel })
</script>

<style scoped>
  .editable:hover {
    background: #f0f8ff;
    cursor: pointer;
  }

  .disabled {
    color: #888;
    cursor: not-allowed;
  }

  .view-mode {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .edit-mode {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 10px;
    min-width: 200px;
    max-width: 50%;
  }

  .edit-mode input {
    background: none;
    outline: none;

    border: 1px solid rgba(0, 0, 0, 0.13);
    border-radius: 3px;
    padding: 5px;
  }

  .edit-mode select {
    background: none;
    border: none;
    outline: none;
  }

  .actions {
    display: flex;
    gap: 6px;
  }

  .action-sprite {
    height: 15px;
    width: 15px;
  }
</style>
