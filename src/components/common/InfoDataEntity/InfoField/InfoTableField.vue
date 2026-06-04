<template>
  <InfoFieldDatetime v-if="props.type === 'datetime'" :value="value" />
  <InfoFieldNumber v-else-if="props.type === 'number'" :value="value" />
  <InfoFieldBoolean v-else-if="props.type === 'boolean'" :value="value" />
  <InfoFieldDefault v-else :value="value" />
</template>

<script setup lang="ts">
  import InfoFieldBoolean from './components/InfoFieldBoolean.vue'
  import InfoFieldDatetime from './components/InfoFieldDatetime.vue'
  import InfoFieldNumber from './components/InfoFieldNumber.vue'
  import InfoFieldDefault from './components/InfoFieldDefault.vue'
  import type { IField } from '@/src/utils/api/models/infoEntiyt.base'

  const props = withDefaults(
    defineProps<{
      value?: unknown
      type?: IField['type']
    }>(),
    {
      type: 'string',
    }
  )
</script>
