<template>
  <div :class="'column'">
    <n-collapse :class="'entities'">
      <n-collapse-item v-for="channel of channels" :class="'entity'" :key="channel.id">
        <!-- #region header -->
        <template #header="{ collapsed }">
          <div class="channel-header">
            <div class="header-title">
              {{ channel.code }}
            </div>
            <template v-if="collapsed">
              <div class="header-tags">
                <n-tag
                  v-for="metric in Object.values(metrics).flatMap(m => m.metric)"
                  size="tiny"
                  :key="metric.id"
                  :color="{ color: '#27F5B0', textColor: '#000', borderColor: '#000' }"
                >
                  {{ metric.name }}
                </n-tag>
              </div>
              <div class="header-tags">
                <n-tag
                  v-for="metric in Object.values(metrics).flatMap(m => m.uf)"
                  size="tiny"
                  :key="metric.id"
                  :class="'header-tags'"
                  :color="{ color: '#FFB269', textColor: '#000', borderColor: '#000' }"
                >
                  {{ metric.name }}
                </n-tag>
              </div>
            </template>
          </div>
        </template>
        <!-- #endregion -->

        <n-tree-select multiple, cascade checkable @update:value="handleUpdateValue" />
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
  import { NTag, NCollapse, NCollapseItem, NTreeSelect, type TreeSelectOption } from 'naive-ui'
  import type { ICompareChannale } from '@/src/views/marketing/strategies/CreateCompareStrategy/types'
  import { onMounted, ref } from 'vue'
  import channelApi from '@/src/utils/api/channel'

  const props = defineProps<{
    channels: ICompareChannale[]
  }>()

  const metrics = ref<
    Record<string, { uf: { id: string; name: string }[]; metric: { id: string; name: string }[] }>
  >({})

  onMounted(async () => {
    for (const channel of props.channels) {
      const channelEntities = await channelApi.getMetricEntities(String(channel.id))
      metrics.value = {
        ...metrics.value,
        [channel.id]: channelEntities,
      }
    }
  })

  const handleUpdateValue = (
    value: string | number | Array<string | number> | null,
    option: TreeSelectOption | null | Array<TreeSelectOption | null>
  ) => {
    console.log(value, option)
  }
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    max-width: 400px;
    padding: 10px;
    @include custom-data-entities-v2-block-borders();
  }

  .entities {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .entity {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    width: 100%;
    height: 100%;
    @include custom-data-entities-v2-block-borders();
  }

  .channel-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: start;
  }

  .header-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }
</style>
