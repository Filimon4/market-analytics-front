<template>
  <div
    :class="{
      disabled: isDisabled,
      editable: canEdit && !isDisabled && !isEditing,
    }"
    @click="toggleEdit"
  >
    <!-- VIEW MODE -->
    <div v-if="!isEditing" class="view-mode">
      <span class="value">{{ displayValue }}</span>
      <span v-if="canEdit && !isDisabled">✎</span>
    </div>

    <!-- EDIT MODE -->
    <div v-else class="edit-mode">
      <input
        v-if="field.type !== 'boolean'"
        v-model="localValue"
        :type="getInputType"
        @click.stop
        @keyup.enter="save"
        @keyup.escape="cancel"
        autofocus
      />

      <select v-else v-model="localValue" @click.stop>
        <option :value="true">Да</option>
        <option :value="false">Нет</option>
      </select>

      <div class="actions">
        <!-- TODO: Переделать на n-button -->
        <button @click.stop="save" class="actions-action save">
          <img class="action-sprite" :src="acceptIcon" alt="accept" />
        </button>
        <button @click.stop="cancel" class="actions-action cancel">
          <img class="action-sprite" :src="cancelIcon" alt="cancel" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { DateTime } from 'luxon'
  import type { IField, Data } from '../CustomDataEntity/CustomDataEntity.types'
  import acceptIcon from '/icons/accept.svg'
  import cancelIcon from '/icons/cancel.svg'

  const props = defineProps<{
    field: IField
    value: Data
  }>()

  const emit = defineEmits<{
    (e: 'update', payload: { field: IField; value: Data[string] }): void
  }>()

  const isEditing = ref(false)
  const localValue = ref(props.value ?? props.field.createDefault ?? '')

  const canEdit = computed(() => props.field?.editable !== false)
  const isDisabled = computed(() => props.field?.editable === false && !props.field?.createEditable)

  const getInputType = computed(() => {
    if (props.field?.type === 'number') return 'number'
    return 'text'
  })

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
    localValue.value = props.value ?? props.field.createDefault ?? ''
    isEditing.value = false
  }
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
    flex-wrap: wrap;
    gap: 10px;
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

  .actions-action {
    display: flex;
    align-items: center;
    padding: 3px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save {
    background: #2f9acc;
  }

  .cancel {
    background: #7c7c7cc0;
  }

  .action-sprite {
    height: 15px;
    width: 15px;
  }
</style>
