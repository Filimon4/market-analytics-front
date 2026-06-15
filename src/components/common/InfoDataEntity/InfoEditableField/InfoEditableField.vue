<template>
  <div
    :class="{
      disabled: infoDataEntityStore.isFieldDisabled(field),
    }"
  >
    <div
      v-if="!isEditing"
      :class="{
        'view-mode': true,
        'resetable-field': infoDataEntityStore.isFieldDiffFromDefault(props.field),
      }"
    >
      <InfoField :field="props.field" @click:edit="toggleEdit" @click:reset="onResetField" />
    </div>

    <div v-else class="edit-mode">
      <InfoEditField :field="props.field" @exist-editing="onExistEditing" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import InfoField from '@/src/components/common/InfoDataEntity/InfoField/InfoField.vue'
  import InfoEditField from '@/src/components/common/InfoDataEntity/InfoEditField/InfoEditField.vue'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import type { IField } from '@/src/utils/api/models/infoEntity.base'

  const infoDataEntityStore = useInfoDataEntityStore()

  const props = defineProps<{
    field: IField
  }>()

  const isEditing = ref(false)

  const onResetField = () => {
    infoDataEntityStore.resetFieldValue(props.field)
  }

  const toggleEdit = () => {
    if (
      !infoDataEntityStore.canEditField(props.field) ||
      infoDataEntityStore.isFieldDisabled(props.field)
    )
      return
    isEditing.value = !isEditing.value
  }

  const onExistEditing = () => {
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

  .resetable-field {
    background: linear-gradient(260deg, rgba(47, 154, 204, 0.22) 0%, rgba(47, 154, 204, 0) 100%);
  }

  .edit-mode {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 10px;
    min-width: 200px;
    width: 100%;
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
</style>
