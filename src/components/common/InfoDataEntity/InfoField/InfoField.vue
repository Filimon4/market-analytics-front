<template>
  <InfoFieldDatetime
    v-if="props.field.type === 'datetime'"
    :value="infoDataEntityStore.getValueOfField(props.field)"
  />
  <InfoFieldNumber
    v-else-if="props.field.type === 'number'"
    :value="infoDataEntityStore.getValueOfField(props.field)"
  />
  <InfoFieldBoolean
    v-else-if="props.field.type === 'boolean'"
    :value="infoDataEntityStore.getValueOfField(props.field)"
  />
  <InfoFieldSelect
    v-else-if="props.field.type === 'select'"
    :value="infoDataEntityStore.getValueOfField(props.field)"
  />
  <InfoFieldFormula
    v-else-if="props.field.type === 'formula'"
    :value="infoDataEntityStore.getValueOfField(props.field)"
  />
  <InfoFieldDefault v-else :value="infoDataEntityStore.getValueOfField(props.field)" />
  <span
    class="editable-cursor"
    v-if="
      infoDataEntityStore.canEditField(props.field) &&
      !infoDataEntityStore.isFieldDisabled(props.field)
    "
    @click="emit('click:edit')"
  >
    <img :src="pencil" alt="edit" :style="{ height: '12px' }" />
  </span>
  <span
    class="editable-cursor"
    v-if="
      infoDataEntityStore.isFieldDiffFromDefault(props.field) &&
      !infoDataEntityStore.isFieldDisabled(props.field)
    "
    @click="emit('click:reset')"
  >
    <img :src="undo" alt="undo" :style="{ height: '12px' }" />
  </span>
</template>

<script setup lang="ts">
  import InfoFieldBoolean from './components/InfoFieldBoolean.vue'
  import InfoFieldDatetime from './components/InfoFieldDatetime.vue'
  import InfoFieldDefault from './components/InfoFieldDefault.vue'
  import InfoFieldFormula from './components/InfoFieldFormula.vue'
  import InfoFieldNumber from './components/InfoFieldNumber.vue'
  import InfoFieldSelect from './components/InfoFieldSelect.vue'
  import undo from '/icons/undo.png'
  import pencil from '/icons/pencil.png'
  import type { IField } from '@/src/utils/api/models/infoEntityV2.base.ts'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2/index.ts'

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const emit = defineEmits<{
    (e: 'click:edit'): void
    (e: 'click:reset'): void
  }>()

  const props = defineProps<{
    field: IField
  }>()
</script>

<style scoped>
  .editable-cursor:hover {
    transform: scale(1.5);
    cursor: pointer;
  }
</style>
