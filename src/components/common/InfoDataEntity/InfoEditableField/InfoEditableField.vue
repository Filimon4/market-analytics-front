<template>
  <div
    :class="{
      disabled: isDisabled,
    }"
  >
    <div v-if="!isEditing" :class="{ 'view-mode': true, 'resetable-field': canBeReseted }">
      <InfoField
        :value="localValue || ''"
        :type="field.type"
        :editable="canEdit"
        :disabled="isDisabled"
        :resetable="canBeReseted && !isDisabled"
        @click:edit="toggleEdit"
        @click:reset="onResetField"
      />
    </div>

    <div v-else class="edit-mode">
      <InfoEditField
        :type="field.type"
        :select-url="field.selectUrl"
        v-model:value="localValue"
        @save="save"
        @cancel="cancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import type { IField } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import InfoField from '@/src/components/common/infodata/infoField/InfoField.vue'
  import InfoEditField from '@/src/components/common/infodata/infoEditField/InfoEditField.vue'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'

  const infoDataEntityStore = useInfoDataEntityStore()

  const props = defineProps<{
    field: IField
  }>()

  const isEditing = ref(false)
  const canBeReseted = computed(() => {
    return infoDataEntityStore.isFieldDiffFromDefault(props.field)
  })
  const localValue = ref()

  const canEdit = computed(() => {
    if (props.field?.createEditable) {
      return props.field?.createEditable
    }

    return props.field?.editable
  })
  const isDisabled = computed(() => props.field?.editable === false && !props.field?.createEditable)

  const onResetField = () => {
    infoDataEntityStore.resetFieldValue(props.field)
  }

  const toggleEdit = () => {
    if (!canEdit.value || isDisabled.value) return
    isEditing.value = !isEditing.value
  }

  const save = () => {
    infoDataEntityStore.updateFieldValue(props.field.editPath || props.field.path, localValue.value)
    infoDataEntityStore.getValueOfField(props.field)
    isEditing.value = false
  }

  const cancel = () => {
    infoDataEntityStore.resetFieldValue(props.field)
    isEditing.value = false
  }

  onMounted(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localValue.value = infoDataEntityStore.getValueOfField(props.field) as any
  })

  watch(
    () => infoDataEntityStore.getValueOfField(props.field),
    () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      localValue.value = infoDataEntityStore.getValueOfField(props.field) as any
    }
  )
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
</style>
