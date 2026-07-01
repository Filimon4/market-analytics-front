<template>
  <div class="block">
    <Block :title="title" :show-actions="false" :actions="[]">
      <div :class="{ 'block-content-thin': true, 'block-content-selection': selectionStyle }">
        <div class="content-columns">
          <slot />
        </div>

        <slot name="add-entity" />
      </div>
    </Block>
  </div>
</template>

<script setup lang="ts">
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'

  defineProps<{
    selectionStyle: boolean
    title: string
  }>()
</script>
