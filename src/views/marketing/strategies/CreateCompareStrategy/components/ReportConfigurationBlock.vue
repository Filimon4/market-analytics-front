<template>
  <div class="block">
    <Block title="Конфигурация отчёта" :actions="[]">
      <div class="block-content-thin report-configuration">
        <div class="configuration-field">
          <div class="configuration-label">Период отчёта</div>
          <n-date-picker
            type="daterange"
            clearable
            :value="periodValue"
            @update:value="updatePeriod"
          />
        </div>
      </div>
      <template #actions>
        <div></div>
      </template>
    </Block>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NDatePicker } from 'naive-ui'
  import { DateTime } from 'luxon'
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'
  import type { ICompareReportConfiguration } from '../types'

  type DateRangeValue = [number, number] | null

  const configuration = defineModel<ICompareReportConfiguration>('value', { required: true })

  const periodValue = computed<DateRangeValue>(() => {
    if (!configuration.value.period) return null

    return [
      DateTime.fromISO(configuration.value.period.startDate).toMillis(),
      DateTime.fromISO(configuration.value.period.endDate).toMillis(),
    ]
  })

  function updatePeriod(value: DateRangeValue) {
    configuration.value = {
      ...configuration.value,
      period: value
        ? {
            startDate: DateTime.fromMillis(value[0]).toISODate() || '',
            endDate: DateTime.fromMillis(value[1]).toISODate() || '',
          }
        : null,
    }
  }
</script>

<style scoped lang="scss">
  .report-configuration {
    flex-direction: column !important;
    align-items: flex-start;
    gap: 16px;
  }

  .configuration-field {
    display: flex;
    flex-direction: column;
    width: 320px;
    gap: 8px;
  }

  .configuration-label {
    font-weight: 500;
  }
</style>
