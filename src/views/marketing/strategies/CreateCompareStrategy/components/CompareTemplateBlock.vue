<template>
  <div class="block">
    <Block title="Дополнительный блок сравнения" :actions="[]">
      <div class="block-content-thin compare-template">
        <!-- TODO: заполнить шаблон блока для сравнения нескольких стратегий. -->
        <div class="template-placeholder">Шаблон для дальнейшего заполнения</div>
      </div>
      <template #actions>
        <div></div>
      </template>
    </Block>
  </div>
</template>

<script setup lang="ts">
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  .compare-template {
    align-items: center;
    justify-content: center;
  }

  .template-placeholder {
    width: 100%;
    padding: 24px;
    text-align: center;
    color: $color-text-secondary;
    @include custom-data-entities-v2-block-borders();
  }
</style>
