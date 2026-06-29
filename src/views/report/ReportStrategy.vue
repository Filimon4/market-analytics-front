<template>
  <div class="strategy-report">
    <NSpin :show="loading">
      <div v-if="report" class="strategy-report__content">
        <header class="strategy-report__header">
          <div>
            <p class="strategy-report__eyebrow">Отчёт сравнение стратегий</p>
            <h1 class="strategy-report__title">{{ report.name }}</h1>
            <p class="strategy-report__description">
              Период: {{ reportPeriodLabel }} · Видимость: {{ report.visibility }}
            </p>
          </div>

          <div class="strategy-report__meta">
            <span>Создан: {{ formatDateTime(report.createdAt) }}</span>
            <span>ID: {{ report.id }}</span>
          </div>
        </header>

        <NAlert v-if="errorMessage" type="error" :bordered="false">
          {{ errorMessage }}
        </NAlert>

        <template v-if="hasRows">
          <section class="strategy-report__block">
            <div class="strategy-report__block-header">
              <div>
                <p class="strategy-report__eyebrow">Полное сравнение</p>
                <h2 class="strategy-report__block-title">Общее сравнение итога</h2>
              </div>
              <p class="strategy-report__block-description">
                Кольцевая диаграмма показывают долю каждой стратегии в общем объеме.
              </p>
            </div>

            <div class="strategy-report__summary-grid">
              <article
                v-for="stat in totalSummary"
                :key="stat.key"
                class="strategy-report__summary-card"
              >
                <span>{{ stat.label }}</span>
                <strong>{{ stat.value }}</strong>
              </article>
            </div>

            <div class="strategy-report__chart-grid">
              <article
                v-for="chart in totalDonutCharts"
                :key="chart.title"
                class="strategy-report__chart-card"
              >
                <div class="strategy-report__chart-header">
                  <h3>{{ chart.title }}</h3>
                  <span>{{ chart.subtitle }}</span>
                </div>
                <apexchart
                  type="donut"
                  height="300"
                  :options="chart.options"
                  :series="chart.series"
                />
              </article>
            </div>
          </section>

          <section class="strategy-report__block">
            <div class="strategy-report__block-header">
              <div>
                <p class="strategy-report__eyebrow">Общее</p>
                <h2 class="strategy-report__block-title">Сравнение общих-показателей</h2>
              </div>
              <p class="strategy-report__block-description">
                Групповой график помогает быстро увидеть разницу по стратегиям и каналам.
              </p>
            </div>

            <div class="strategy-report__chart-card strategy-report__chart-card--wide">
              <apexchart
                type="bar"
                height="360"
                :options="totalBarOptions"
                :series="totalBarSeries"
              />
            </div>
          </section>

          <section v-if="metricCharts.length" class="strategy-report__block">
            <div class="strategy-report__block-header">
              <div>
                <p class="strategy-report__eyebrow">Метрики</p>
                <h2 class="strategy-report__block-title">Маркетинговые метрики</h2>
              </div>
            </div>

            <div class="strategy-report__chart-grid">
              <article
                v-for="chart in metricCharts"
                :key="chart.title"
                class="strategy-report__chart-card"
              >
                <div class="strategy-report__chart-header">
                  <h3>{{ chart.title }}</h3>
                  <span>{{ chart.subtitle }}</span>
                </div>
                <apexchart
                  type="bar"
                  height="280"
                  :options="chart.options"
                  :series="chart.series"
                />
              </article>
            </div>
          </section>

          <section v-if="ufCharts.length" class="strategy-report__block">
            <div class="strategy-report__block-header">
              <div>
                <p class="strategy-report__eyebrow">Свойства</p>
                <h2 class="strategy-report__block-title">Пользовательские показатели</h2>
              </div>
            </div>

            <div class="strategy-report__chart-grid">
              <article
                v-for="chart in ufCharts"
                :key="chart.title"
                class="strategy-report__chart-card"
              >
                <div class="strategy-report__chart-header">
                  <h3>{{ chart.title }}</h3>
                  <span>{{ chart.subtitle }}</span>
                </div>
                <apexchart
                  type="bar"
                  height="280"
                  :options="chart.options"
                  :series="chart.series"
                />
              </article>
            </div>
          </section>

          <section class="strategy-report__block">
            <div class="strategy-report__block-header">
              <div>
                <p class="strategy-report__eyebrow">Детали</p>
                <h2 class="strategy-report__block-title">Данные по стратегиям</h2>
              </div>
            </div>

            <div class="strategy-report__details-grid">
              <article v-for="row in rows" :key="row.id" class="strategy-report__details-card">
                <div class="strategy-report__details-head">
                  <h3>{{ row.data.strategy.name }}</h3>
                  <span>{{ row.data.channel.name }}</span>
                </div>

                <div class="strategy-report__details-section">
                  <h4>Итоги</h4>
                  <dl>
                    <template v-for="definition in totalDefinitions" :key="definition.key">
                      <dt>{{ definition.label }}</dt>
                      <dd>{{ formatNumber(row.data.totals[definition.key]) }}</dd>
                    </template>
                  </dl>
                </div>

                <div class="strategy-report__details-section">
                  <h4>Метрики</h4>
                  <dl>
                    <template v-for="metric in row.data.metrics" :key="metric.id">
                      <dt>{{ metric.name }}</dt>
                      <dd>{{ formatNumber(metric.value) }}</dd>
                    </template>
                  </dl>
                </div>

                <div class="strategy-report__details-section">
                  <h4>Свойства</h4>
                  <dl>
                    <template v-for="uf in row.data.uf" :key="uf.id">
                      <dt>{{ uf.name }}</dt>
                      <dd>{{ formatNumber(uf.value) }}</dd>
                    </template>
                  </dl>
                </div>
              </article>
            </div>
          </section>
        </template>

        <NEmpty v-else description="В отчете нет данных для визуализации" />
      </div>

      <NAlert v-else-if="errorMessage && !loading" type="error" :bordered="false">
        {{ errorMessage }}
      </NAlert>

      <NEmpty v-else-if="!loading" description="Отчет не найден" />
    </NSpin>
  </div>
</template>

<script setup lang="ts">
  import type { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions } from 'apexcharts'
  import { NAlert, NEmpty, NSpin } from 'naive-ui'
  import { DateTime } from 'luxon'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import reportApi from '@/src/utils/api/report'
  import type {
    IStrategyCompareReport,
    IStrategyCompareReportRow,
    IStrategyCompareReportTotals,
    IStrategyCompareReportValue,
  } from '@/src/utils/api/models/report'

  type TotalKey = keyof IStrategyCompareReportTotals

  interface TotalDefinition {
    key: TotalKey
    label: string
  }

  interface TotalSummaryItem extends TotalDefinition {
    value: string
  }

  interface DonutChart {
    title: string
    subtitle: string
    options: ApexOptions
    series: ApexNonAxisChartSeries
  }

  interface BarChart {
    title: string
    subtitle: string
    options: ApexOptions
    series: ApexAxisChartSeries
  }

  const route = useRoute()

  const report = ref<IStrategyCompareReport | null>(null)
  const loading = ref(false)
  const errorMessage = ref('')

  const chartColors = ['#2f9acc', '#18a058', '#f0a020', '#d03050', '#8a5cf6', '#0ea5e9']

  const totalDefinitions: TotalDefinition[] = [
    { key: 'impressions', label: 'Показы' },
    { key: 'clicks', label: 'Клики' },
    { key: 'spend', label: 'Расход' },
    { key: 'leads', label: 'Лиды' },
  ]

  const reportId = computed(() => {
    const routeId = route.params.id
    return Array.isArray(routeId) ? routeId[0] : routeId
  })

  const rows = computed(
    () =>
      report.value?.reportResults
        .flatMap(result => result.rows)
        .sort((firstRow, secondRow) => firstRow.rowIndex - secondRow.rowIndex) ?? []
  )

  const hasRows = computed(() => rows.value.length > 0)
  const rowLabels = computed(() => rows.value.map(row => getRowLabel(row)))

  const reportPeriodLabel = computed(() => {
    if (!report.value) return '-'

    return formatPeriod(
      report.value.config.reportConfiguration?.period ?? {
        startDate: report.value.dateFrom,
        endDate: report.value.dateTo,
      }
    )
  })

  const totalSummary = computed<TotalSummaryItem[]>(() =>
    totalDefinitions.map(definition => ({
      ...definition,
      value: formatNumber(sumTotal(definition.key)),
    }))
  )

  const totalDonutCharts = computed<DonutChart[]>(() =>
    totalDefinitions.map(definition => {
      const series = rows.value.map(row => row.data.totals[definition.key])
      const total = series.reduce((sum, value) => sum + value, 0)

      return {
        title: definition.label,
        subtitle: `Всего: ${formatNumber(total)}`,
        series,
        options: createDonutOptions(rowLabels.value, total),
      }
    })
  )

  const totalBarSeries = computed<ApexAxisChartSeries>(() =>
    totalDefinitions.map(definition => ({
      name: definition.label,
      data: rows.value.map(row => row.data.totals[definition.key]),
    }))
  )

  const totalBarOptions = computed<ApexOptions>(() => createBarOptions(rowLabels.value))

  const metricCharts = computed<BarChart[]>(() =>
    getUniqueValueNames(rows.value.flatMap(row => row.data.metrics)).map(metricName =>
      createValueBarChart(
        metricName,
        'Значение по стратегиям',
        rows.value.map(row => getValueByName(row.data.metrics, metricName))
      )
    )
  )

  const ufCharts = computed<BarChart[]>(() =>
    getUniqueValueNames(rows.value.flatMap(row => row.data.uf)).map(ufName =>
      createValueBarChart(
        ufName,
        'Значение по стратегиям',
        rows.value.map(row => getValueByName(row.data.uf, ufName))
      )
    )
  )

  watch(
    reportId,
    async id => {
      if (!id) {
        report.value = null
        errorMessage.value = 'Не указан идентификатор отчета'
        return
      }

      loading.value = true
      errorMessage.value = ''

      try {
        report.value = await reportApi.getStrategyReport(id)
      } catch {
        report.value = null
        errorMessage.value = 'Не удалось загрузить отчет сравнения стратегий'
      } finally {
        loading.value = false
      }
    },
    { immediate: true }
  )

  function createDonutOptions(labels: string[], total: number): ApexOptions {
    return {
      chart: {
        toolbar: { show: false },
      },
      colors: chartColors,
      labels,
      legend: {
        position: 'bottom',
        fontSize: '13px',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Всего',
                formatter: () => formatCompact(total),
              },
            },
          },
        },
      },
      stroke: {
        width: 2,
      },
      tooltip: {
        y: {
          formatter: (value: number) => formatNumber(value),
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 260,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    }
  }

  function createBarOptions(categories: string[]): ApexOptions {
    return {
      chart: {
        toolbar: { show: false },
      },
      colors: chartColors,
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '48%',
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => formatNumber(value),
        },
      },
      xaxis: {
        categories,
        labels: {
          rotate: -15,
          trim: true,
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => formatCompact(value),
        },
      },
    }
  }

  function createValueBarChart(title: string, subtitle: string, data: number[]): BarChart {
    return {
      title,
      subtitle,
      options: createBarOptions(rowLabels.value),
      series: [
        {
          name: title,
          data,
        },
      ],
    }
  }

  function getRowLabel(row: IStrategyCompareReportRow) {
    return `${row.data.strategy.name} / ${row.data.channel.name}`
  }

  function getUniqueValueNames(values: IStrategyCompareReportValue[]) {
    return Array.from(new Set(values.map(value => value.name)))
  }

  function getValueByName(values: IStrategyCompareReportValue[], name: string) {
    return values.find(value => value.name === name)?.value ?? 0
  }

  function sumTotal(key: TotalKey) {
    return rows.value.reduce((sum, row) => sum + row.data.totals[key], 0)
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 2,
    }).format(value)
  }

  function formatCompact(value: number) {
    return new Intl.NumberFormat('ru-RU', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  function formatDate(value: string | null) {
    if (!value) return '-'
    return DateTime.fromISO(value).toFormat('dd.MM.yyyy')
  }

  function formatDateTime(value: string) {
    return DateTime.fromISO(value).toFormat('dd.MM.yyyy HH:mm')
  }

  function formatPeriod(period?: { startDate: string | null; endDate: string | null }) {
    if (!period?.startDate && !period?.endDate) return 'за всё время'
    return `${formatDate(period.startDate)} - ${formatDate(period.endDate)}`
  }
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  .strategy-report {
    width: 100%;
    padding: 10px;
  }

  .strategy-report__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .strategy-report__header,
  .strategy-report__block,
  .strategy-report__chart-card,
  .strategy-report__summary-card,
  .strategy-report__details-card {
    background: $color-surface;
    @include custom-data-entities-v2-block-borders();
  }

  .strategy-report__header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
  }

  .strategy-report__eyebrow {
    margin: 0 0 6px;
    color: $color-primary;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .strategy-report__title,
  .strategy-report__block-title {
    margin: 0;
    color: $color-text-strong;
    font-weight: 600;
  }

  .strategy-report__title {
    font-size: 24px;
  }

  .strategy-report__block-title {
    font-size: 20px;
  }

  .strategy-report__description,
  .strategy-report__block-description,
  .strategy-report__chart-header span,
  .strategy-report__details-head span {
    margin: 6px 0 0;
    color: $color-text-secondary;
  }

  .strategy-report__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    color: $color-text-secondary;
    white-space: nowrap;
  }

  .strategy-report__block {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .strategy-report__block-header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .strategy-report__block-description {
    max-width: 520px;
    text-align: right;
  }

  .strategy-report__summary-grid,
  .strategy-report__chart-grid,
  .strategy-report__details-grid {
    display: grid;
    gap: 16px;
  }

  .strategy-report__summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .strategy-report__summary-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    background: $color-surface-action;
  }

  .strategy-report__summary-card span {
    color: $color-text-secondary;
  }

  .strategy-report__summary-card strong {
    color: $color-text-strong;
    font-size: 22px;
  }

  .strategy-report__chart-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .strategy-report__chart-card {
    min-width: 0;
    padding: 16px;
  }

  .strategy-report__chart-card--wide {
    width: 100%;
  }

  .strategy-report__chart-header {
    margin-bottom: 12px;
  }

  .strategy-report__chart-header h3,
  .strategy-report__details-head h3,
  .strategy-report__details-section h4 {
    margin: 0;
    color: $color-text-strong;
  }

  .strategy-report__chart-header h3,
  .strategy-report__details-head h3 {
    font-size: 16px;
  }

  .strategy-report__details-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .strategy-report__details-card {
    overflow: hidden;
  }

  .strategy-report__details-head {
    padding: 14px 16px;
    background: $color-surface-header;
    border-bottom: 1px solid $color-border-default;
  }

  .strategy-report__details-section {
    padding: 14px 16px;
    border-bottom: 1px solid $color-border-light;
  }

  .strategy-report__details-section:last-child {
    border-bottom: 0;
  }

  .strategy-report__details-section h4 {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .strategy-report__details-section dl {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 14px;
    margin: 0;
  }

  .strategy-report__details-section dt {
    color: $color-text-secondary;
  }

  .strategy-report__details-section dd {
    margin: 0;
    color: $color-text-primary;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .strategy-report__header,
    .strategy-report__block-header {
      flex-direction: column;
    }

    .strategy-report__meta {
      align-items: flex-start;
      white-space: normal;
    }

    .strategy-report__block-description {
      text-align: left;
    }
  }
</style>
