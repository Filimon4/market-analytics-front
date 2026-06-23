<template>
  <div class="entity-wrapper">
    <div class="blocks">
      <!-- TODO: Выбор стратегий -->
      <div class="block">
        <Block title="Выбор стратегий" :actions="[]">
          <div class="block-content-thin strategies">
            <div class="strategies-content">
              <div
                v-for="strategy in selectedStrategies"
                :key="strategy.id"
                class="strategy-column"
              >
                <div class="strategy-header">
                  <div class="strategy-title">{{ strategy.code }}</div>
                  <n-button size="small" tertiary type="error" @click="removeStrategy(strategy.id)">
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
                    <div class="detail-label">Конверсия</div>
                    <div class="detail-value">
                      {{ strategy.statistics?.totals.conversions ?? '-' }} %
                    </div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">Лиды</div>
                    <div class="detail-value">{{ strategy.statistics?.totals.leads ?? '-' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="add-strategy">
              <n-button
                type="primary"
                :loading="strategiesDetailsLoading"
                @click="openStrategyModal"
                dashed
                style="width: 100%"
                >+</n-button
              >
            </div>
          </div>
          <template #actions>
            <div></div>
          </template>
        </Block>
      </div>

      <div v-if="selectedStrategies.length >= 2" class="block">
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
    </div>

    <select-list-modal
      v-model:show="showStrategyModal"
      title="Выбрать стратегии"
      confirm-text="Добавить"
      empty-text="Список стратегий пуст"
      :fetch-items="loadStrategies"
      :initial-selected-ids="selectedStrategyIds"
      @confirm="saveSelectedStrategies"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { NButton, NTime } from 'naive-ui'
  import Block from '@/src/components/Layout/CustomDataEntityV2/Block/Block.vue'
  import SelectListModal from '@/src/components/Ui/SelectListModal/SelectListModal.vue'
  import type {
    ISelectListItem,
    SelectListItemId,
  } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import strategyApi from '@/src/utils/api/strategy'
  import { DateTime } from 'luxon'

  type StrategyStatistics = Awaited<ReturnType<typeof strategyApi.statistics>>

  interface ICompareStrategy extends ISelectListItem {
    code?: string
    status?: string
    createdAt?: string
    statistics?: StrategyStatistics
  }

  interface IPeriod {
    startDate: string
    endDate: string
  }

  const showStrategyModal = ref(false)
  const strategiesDetailsLoading = ref(false)
  const selectedStrategies = ref<ICompareStrategy[]>([])

  const selectedStrategyIds = computed(() => selectedStrategies.value.map(strategy => strategy.id))

  function loadStrategies() {
    return strategyApi.select()
  }

  async function loadStrategyDetails(strategy: ISelectListItem): Promise<ICompareStrategy> {
    const statistics = await strategyApi.statistics(Number(strategy.id))
    return {
      ...strategy,
      statistics,
    } as ICompareStrategy
  }

  function openStrategyModal() {
    showStrategyModal.value = true
  }

  async function saveSelectedStrategies(items: ISelectListItem[]) {
    strategiesDetailsLoading.value = true
    try {
      selectedStrategies.value = await Promise.all(items.map(loadStrategyDetails))
    } finally {
      strategiesDetailsLoading.value = false
    }
  }

  function removeStrategy(strategyId: SelectListItemId) {
    selectedStrategies.value = selectedStrategies.value.filter(
      strategy => strategy.id !== strategyId
    )
  }

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
  @use '@/src/components/Layout/InfoDataEntity/styles/InfoDataEntityV2.mixins' as *;

  @include custom-data-entity-v2-children;
  @include custom-data-entities-v2-blocks;
  @include custom-data-entity;

  .strategies {
    align-items: center;
    justify-content: end;
    flex-direction: column;
    gap: 10px;
  }

  .strategies-content {
    display: flex;
    flex-grow: 1;
    width: 100%;
    gap: 10px;
    border-radius: 10px;
  }

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

  .add-strategy {
    width: 80%;
    display: flex;
    align-items: flex-start;
  }

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
