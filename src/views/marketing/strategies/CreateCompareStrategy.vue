<template>
  <div class="entity-wrapper">
    <div class="blocks">
      <!-- TODO: Выбор стратегий -->
      <div class="block">
        <Block title="Выбор стратегий" :actions="[]">
          <div class="strategies">
            <n-dropdown>
              <n-button>+</n-button>
            </n-dropdown>
          </div>
          <template #actions>
            <div></div>
          </template>
        </Block>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NDropdown, NButton } from 'naive-ui'
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'
  import { ref } from 'vue'

  const strategies = ref([])
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;
  @use '@/src/components/Layout/InfoDataEntity/styles/InfoDataEntityV2.mixins' as *;

  @include custom-data-entity-v2-children;
  @include custom-data-entities-v2-blocks;
  @include custom-data-entity;

  .strategies {
    display: flex;

    height: 100%;
    width: 100%;
  }
</style>
