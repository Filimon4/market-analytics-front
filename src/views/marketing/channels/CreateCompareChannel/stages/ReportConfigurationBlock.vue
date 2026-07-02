<template>
  <div class="block">
    <Block :show-actions="false" title="Конфигурация отчёта" :actions="[]">
      <div class="block-content-thin report-configuration">
        <n-collapse class="configuration-list">
          <n-collapse-item title="Период отчёта" name="period">
            <div class="configuration-property">
              <n-date-picker
                type="daterange"
                clearable
                :value="periodValue"
                @update:value="updatePeriod"
              />
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>
    </Block>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NCollapse, NCollapseItem, NDatePicker } from 'naive-ui'
  import { DateTime } from 'luxon'
  import { storeToRefs } from 'pinia'
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'
  import { useCompareChannelStore } from '@/src/store/compareChannel'

  type DateRangeValue = [number, number] | null

  const compareChannelStore = useCompareChannelStore()
  const { reportConfiguration } = storeToRefs(compareChannelStore)
  const { setReportPeriod } = compareChannelStore

  const periodValue = computed<DateRangeValue>(() => {
    if (!reportConfiguration.value.period) return null

    return [
      DateTime.fromISO(reportConfiguration.value.period.startDate).toMillis(),
      DateTime.fromISO(reportConfiguration.value.period.endDate).toMillis(),
    ]
  })

  function updatePeriod(value: DateRangeValue) {
    setReportPeriod(
      value
        ? {
            startDate: DateTime.fromMillis(value[0]).toISODate() || '',
            endDate: DateTime.fromMillis(value[1]).toISODate() || '',
          }
        : null
    )
  }
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  .report-configuration {
    flex-direction: column !important;
    gap: 12px;
  }

  .configuration-list {
    width: 100%;
  }

  .configuration-list :deep(.n-collapse-item) {
    margin: 0 0 12px;
    padding: 0;
    @include custom-data-entities-v2-block-borders();
  }

  .configuration-list :deep(.n-collapse-item__header) {
    padding: 14px 16px;
    font-weight: 500;
  }

  .configuration-list :deep(.n-collapse-item__content-inner) {
    padding: 0 16px 16px;
  }

  .configuration-property {
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>
