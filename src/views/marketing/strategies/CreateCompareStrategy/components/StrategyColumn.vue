<template>
  <div class="strategy-column">
    <div class="strategy-header">
      <div class="strategy-title">{{ strategy.code }}</div>
      <n-button size="small" tertiary type="error" @click="emit('remove', strategy.id)">
        X
      </n-button>
    </div>
    <div class="strategy-info">
      <div class="detail-row">
        <div class="detail-label">ID</div>
        <div class="detail-value">{{ strategy.id }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Код</div>
        <div class="detail-value">{{ strategy.code || '-' }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Название</div>
        <div class="detail-value">{{ strategy.statistics?.strategy.name || '-' }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Удалена</div>
        <div class="detail-value">
          {{ strategy.statistics?.strategy.deleted ? 'Да' : 'Нет' }}
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Описание</div>
        <div class="detail-value">{{ strategy.description || '-' }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Создана</div>
        <div class="detail-value">
          <NTime :time="DateTime.fromISO(strategy.createdAt || '').toMillis()" />
        </div>
      </div>
      <div class="detail-section-title">Каналы</div>
      <div class="detail-row">
        <div class="detail-label">Всего</div>
        <div class="detail-value">{{ strategy.statistics?.channels.total ?? '-' }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Активные</div>
        <div class="detail-value">
          {{ strategy.statistics?.channels.active ?? '-' }}
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Удалённые</div>
        <div class="detail-value">
          {{ strategy.statistics?.channels.deleted ?? '-' }}
        </div>
      </div>
      <div class="detail-section-title">Трафик</div>
      <div class="detail-row">
        <div class="detail-label">Всего</div>
        <div class="detail-value">
          {{ strategy.statistics?.performanceRecords.total ?? '-' }}
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Активные</div>
        <div class="detail-value">
          {{ strategy.statistics?.performanceRecords.active ?? '-' }}
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Удалённые</div>
        <div class="detail-value">
          {{ strategy.statistics?.performanceRecords.deleted ?? '-' }}
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Период</div>
        <div class="detail-value">
          {{ formatPeriod(strategy.statistics?.performanceRecords.period) }}
        </div>
      </div>
      <div class="detail-section-title">Итог</div>
      <div class="detail-row">
        <div class="detail-label">Потрачено</div>
        <div class="detail-value">{{ strategy.statistics?.totals.spend ?? '-' }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Просмотров</div>
        <div class="detail-value">
          {{ strategy.statistics?.totals.impressions ?? '-' }}
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Кликов</div>
        <div class="detail-value">{{ strategy.statistics?.totals.clicks ?? '-' }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Лиды</div>
        <div class="detail-value">{{ strategy.statistics?.totals.leads ?? '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NButton, NTime } from 'naive-ui'
  import { DateTime } from 'luxon'
  import type { SelectListItemId } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import type { ICompareStrategy, IPeriod } from '../types'

  defineProps<{
    strategy: ICompareStrategy
  }>()

  const emit = defineEmits<{
    remove: [strategyId: SelectListItemId]
  }>()

  function formatDate(value?: string) {
    if (!value) return '-'
    return DateTime.fromISO(value).toFormat('dd.MM.yyyy')
  }

  function formatPeriod(period?: IPeriod) {
    if (!period) return '-'
    return `${formatDate(period.startDate)} - ${formatDate(period.endDate)}`
  }
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  .strategy-column {
    flex: 1;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 10px;
    @include custom-data-entities-v2-block-borders();
  }

  .strategy-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .strategy-title {
    font-weight: 600;
  }

  .strategy-info {
    display: flex;
    flex-direction: column;
    border-top: 1px solid $color-border-table;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 1fr 5fr;
    gap: 12px;
    padding: 12px;
    border-bottom: 1px solid $color-border-table;
  }

  .detail-section-title {
    padding: 12px;
    font-weight: 600;
    color: $color-text-strong;
    background: $color-surface-header;
    border-bottom: 1px solid $color-border-table;
  }

  .detail-label {
    font-weight: 500;
    color: $color-text-secondary;
  }

  .detail-value {
    color: $color-text-primary;
  }
</style>
