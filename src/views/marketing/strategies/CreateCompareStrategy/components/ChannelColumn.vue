<template>
  <div class="column">
    <div class="channels">
      <div v-for="channel of channels" class="channels-element" :key="channel.id">
        <div>
          {{ channel.code }}
        </div>
        <n-button size="small" tertiary type="error" @click="emit('remove', channel.id)">
          X
        </n-button>
      </div>
    </div>
    <slot name="add-entity" />
  </div>
</template>

<script setup lang="ts">
  import { NButton } from 'naive-ui'
  import type {
    ICompareChannale,
    ICompareStrategy,
  } from '@/src/views/marketing/strategies/CreateCompareStrategy/types'
  import type { SelectListItemId } from '@/src/components/Ui/SelectListModal/SelectListModal.types'

  defineProps<{
    strategy: ICompareStrategy
    channels: ICompareChannale[]
  }>()

  const emit = defineEmits<{
    remove: [channelId: SelectListItemId]
  }>()
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  .column {
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    @include custom-data-entities-v2-block-borders();
  }

  .channels {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .channels-element {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    width: 100%;
    height: 100%;
    @include custom-data-entities-v2-block-borders();
  }
</style>
