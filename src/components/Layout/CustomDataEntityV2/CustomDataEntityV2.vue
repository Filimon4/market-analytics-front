<template>
  <div v-if="props.loading" class="loading-overlay" />
  <Affix
    v-if="props.loading"
    :top="'50%'"
    :right="'50%'"
    :transform="'translateX(50%)'"
    :z-index="10000"
  >
    <n-spin size="large" />
  </Affix>
  <div class="blocks">
    <div v-for="block in infoDataEntityStore.blocksData" :key="block.code" class="block">
      <template v-if="block.blockType === 'listEntity'">
        <slot name="listEntity" :block="block"></slot>
      </template>
      <template v-else-if="block.blockType === 'table'">
        <slot name="table" :block="block"></slot>
      </template>
      <template v-else-if="block.blockType === 'tree'">
        <slot name="tree" :block="block"></slot>
      </template>
      <template v-else-if="block.blockType === 'viewListEntity'">
        <slot name="viewListEntity" :block="block"></slot>
      </template>
      <template v-else-if="block.blockType === 'reportBuilder'">
        <slot name="reportBuilder" :block="block"></slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'
  import Affix from '../../common/Affix/Affix.vue'

  const props = withDefaults(
    defineProps<{
      loading: boolean
    }>(),
    {
      loading: true,
    }
  )

  const infoDataEntityStore = useInfoDataEntityStoreV2()
</script>

<style scoped lang="scss">
  @use './styles/custom-data-entity-v2.mixins' as *;

  /* Parent */
  .blocks {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    height: 100%;
    padding: 24px;
  }

  .block {
    display: flex;
    flex-direction: column;
    background: $color-surface-translucent;
    border: 1px solid $color-border-default;
    border-radius: 8px;
    min-height: 450px;
  }

  @include custom-data-entity-v2-children;
</style>
