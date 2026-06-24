<template>
  <div class="block">
    <Block title="Выбор стратегий" :show-actions="false" :actions="[]">
      <div class="block-content-thin block-content-selection">
        <div class="content-columns">
          <slot />
        </div>

        <div class="content-add">
          <slot name="add-entity" />
        </div>
      </div>
    </Block>
  </div>
</template>

<script setup lang="ts">
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'
</script>
