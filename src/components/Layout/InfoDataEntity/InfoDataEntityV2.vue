<template>
  <div class="entity-wrapper">
    <CustomDataEntityV2 :loading="loading">
      <template #metrics="{ block }">
        <BlockMetricContent :block="block" />
      </template>
    </CustomDataEntityV2>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CustomDataEntityV2 from '../CustomDataEntityV2/CustomDataEntityV2.vue'
  import BlockMetricContent from '../CustomDataEntityV2/DataContentTypeV2/BlockMetricContent.vue'

  const loading = ref<boolean>(true)
</script>

<style>
  .entity-wrapper {
    height: 100%;
    width: 100%;
    position: relative;
  }
</style>
