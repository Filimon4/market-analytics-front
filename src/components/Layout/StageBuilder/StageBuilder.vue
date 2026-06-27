<template>
  <section class="stage-builder">
    <slot
      name="header"
      :stage="activeStage"
      :stage-index="activeStageIndex"
      :progress="progressPercent"
    >
      <header class="stage-builder__header">
        <p class="stage-builder__eyebrow">{{ currentStepLabel }}</p>
        <h2 class="stage-builder__title">{{ activeStage?.title }}</h2>
        <p v-if="activeStage?.description" class="stage-builder__description">
          {{ activeStage.description }}
        </p>
      </header>
    </slot>

    <slot
      v-if="showProgress"
      name="progress"
      :stages="visibleStages"
      :stage="activeStage"
      :stage-index="activeStageIndex"
      :progress="progressPercent"
      :go-to="goToStage"
    >
      <nav class="stage-builder__progress" aria-label="Stage progress">
        <button
          v-for="(stage, index) in visibleStages"
          :key="stage.code"
          class="stage-builder__step"
          :class="getStepClass(index)"
          :disabled="!allowStageClick || index === activeStageIndex"
          type="button"
          @click="goToStage(stage.code)"
        >
          <span class="stage-builder__step-marker">{{ index + 1 }}</span>
          <span class="stage-builder__step-content">
            <span class="stage-builder__step-title">{{ stage.title }}</span>
            <span v-if="stage.description" class="stage-builder__step-description">
              {{ stage.description }}
            </span>
          </span>
        </button>
      </nav>

      <div class="stage-builder__progress-line">
        <div class="stage-builder__progress-fill" :style="{ width: `${progressPercent}%` }" />
      </div>
    </slot>

    <main>
      <slot
        v-if="activeStage"
        :name="activeStage.slot ?? activeStage.code"
        :stage="activeStage"
        :stage-index="activeStageIndex"
        :is-first="isFirstStage"
        :is-last="isLastStage"
        :back="goBack"
        :next="goNext"
        :go-to="goToStage"
      >
        <slot
          :stage="activeStage"
          :stage-index="activeStageIndex"
          :is-first="isFirstStage"
          :is-last="isLastStage"
          :back="goBack"
          :next="goNext"
          :go-to="goToStage"
        />
      </slot>
    </main>

    <Affix :display="'fixed'" :bottom="'10px'" :right="'50%'" :transform="'translateX(50%)'">
      <footer class="stage-builder__actions">
        <n-button :disabled="!canGoBack" @click="goBack">
          {{ backText }}
        </n-button>
        <n-button type="primary" :disabled="!canGoNext" @click="goNext" color="#2f9acc">
          {{ isLastStage ? finishText : nextText }}
        </n-button>
      </footer>
    </Affix>
  </section>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { NButton } from 'naive-ui'
  import Affix from '@/src/components/common/Affix/Affix.vue'
  import type {
    StageBuilderSlotProps,
    StageBuilderStage,
  } from '@/src/components/Layout/StageBuilder/types'

  defineSlots<
    {
      header?: (props: Pick<StageBuilderSlotProps, 'stage' | 'stageIndex' | 'progress'>) => unknown
      progress?: (
        props: Pick<StageBuilderSlotProps, 'stages' | 'stage' | 'stageIndex' | 'progress' | 'goTo'>
      ) => unknown
      default?: (
        props: Pick<
          StageBuilderSlotProps,
          'stage' | 'stageIndex' | 'isFirst' | 'isLast' | 'back' | 'next' | 'goTo'
        >
      ) => unknown
    } & Record<
      string,
      (
        props: Pick<
          StageBuilderSlotProps,
          'stage' | 'stageIndex' | 'isFirst' | 'isLast' | 'back' | 'next' | 'goTo'
        >
      ) => unknown
    >
  >()

  const currentStage = defineModel<string>('currentStage', { default: '' })

  const props = withDefaults(
    defineProps<{
      stages: StageBuilderStage[]
      backText?: string
      nextText?: string
      finishText?: string
      showProgress?: boolean
      allowStageClick?: boolean
      disableBack?: boolean
      disableNext?: boolean
    }>(),
    {
      backText: 'Назад',
      nextText: 'Вперёд',
      finishText: 'Подтвердить',
      showProgress: true,
      allowStageClick: false,
      disableBack: false,
      disableNext: false,
    }
  )

  const emit = defineEmits<{
    back: [stage: StageBuilderStage, previousStage: StageBuilderStage]
    next: [stage: StageBuilderStage, nextStage?: StageBuilderStage]
    finish: [stage: StageBuilderStage]
    change: [stage: StageBuilderStage, previousStage?: StageBuilderStage]
  }>()

  const visibleStages = computed(() => props.stages.filter(stage => !stage.hidden))

  const activeStageIndex = computed(() => {
    const stageIndex = visibleStages.value.findIndex(stage => stage.code === currentStage.value)
    return stageIndex >= 0 ? stageIndex : 0
  })

  const activeStage = computed(() => visibleStages.value[activeStageIndex.value])
  const isFirstStage = computed(() => activeStageIndex.value === 0)
  const isLastStage = computed(() => activeStageIndex.value === visibleStages.value.length - 1)

  const canGoBack = computed(() => {
    if (props.disableBack || activeStage.value?.disableBack) return false
    return activeStageIndex.value > 0
  })

  const canGoNext = computed(() => {
    if (!activeStage.value || props.disableNext || activeStage.value.disableNext) return false
    return visibleStages.value.length > 0
  })

  const progressPercent = computed(() => {
    if (visibleStages.value.length <= 1) return visibleStages.value.length ? 100 : 0
    return Math.round((activeStageIndex.value / (visibleStages.value.length - 1)) * 100)
  })

  const currentStepLabel = computed(() => {
    if (!visibleStages.value.length) return 'Пусто'
    return `Шаг ${activeStageIndex.value + 1} из ${visibleStages.value.length}`
  })

  function getStepClass(index: number) {
    return {
      'stage-builder__step--active': index === activeStageIndex.value,
      'stage-builder__step--complete': index < activeStageIndex.value,
      'stage-builder__step--clickable': props.allowStageClick && index !== activeStageIndex.value,
    }
  }

  function setStage(stageCode: string) {
    const nextStage = visibleStages.value.find(stage => stage.code === stageCode)
    if (!nextStage || nextStage.code === currentStage.value) return

    const previousStage = activeStage.value
    currentStage.value = nextStage.code
    emit('change', nextStage, previousStage)
  }

  function goToStage(stageCode: string) {
    if (!props.allowStageClick) return
    setStage(stageCode)
  }

  function goBack() {
    if (!canGoBack.value) return

    const previousStage = visibleStages.value[activeStageIndex.value - 1]
    const current = activeStage.value
    if (!previousStage || !current) return

    setStage(previousStage.code)
    emit('back', current, previousStage)
  }

  function goNext() {
    if (!canGoNext.value || !activeStage.value) return

    if (isLastStage.value) {
      emit('finish', activeStage.value)
      return
    }

    const nextStage = visibleStages.value[activeStageIndex.value + 1]
    const current = activeStage.value
    if (!nextStage) return

    setStage(nextStage.code)
    emit('next', current, nextStage)
  }

  watch(
    visibleStages,
    stages => {
      if (!stages.length) {
        currentStage.value = ''
        return
      }

      const currentStageExists = stages.some(stage => stage.code === currentStage.value)
      const firstStage = stages[0]
      if (!currentStageExists && firstStage) {
        currentStage.value = firstStage.code
      }
    },
    { immediate: true }
  )
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  .stage-builder {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  .stage-builder__header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 24px;
    border-radius: 10px;
    background: $color-surface;
    @include custom-data-entities-v2-block-borders();
  }

  .stage-builder__eyebrow {
    color: $color-primary;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .stage-builder__title {
    color: $color-text-strong;
    font-size: 22px;
    font-weight: 600;
  }

  .stage-builder__description {
    max-width: 760px;
    color: $color-text-secondary;
  }

  .stage-builder__progress {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }

  .stage-builder__step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
    padding: 14px;
    border: 1px solid $color-border-action;
    border-radius: 10px;
    background: $color-surface-action;
    color: $color-text-secondary;
    text-align: left;
    transition:
      border-color 0.16s ease,
      background 0.16s ease,
      color 0.16s ease;
  }

  .stage-builder__step:disabled {
    cursor: default;
  }

  .stage-builder__step--clickable {
    cursor: pointer;
  }

  .stage-builder__step--clickable:hover {
    background: $color-surface-hover;
  }

  .stage-builder__step--active {
    border-color: $color-primary;
    background: $color-surface-blue-hover;
    color: $color-text-strong;
  }

  .stage-builder__step--complete {
    border-color: $color-primary;
  }

  .stage-builder__step-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: $color-white;
    color: $color-text-muted;
    font-size: 13px;
    font-weight: 600;
  }

  .stage-builder__step--active .stage-builder__step-marker,
  .stage-builder__step--complete .stage-builder__step-marker {
    background: $color-primary;
    color: $color-white;
  }

  .stage-builder__step-content {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .stage-builder__step-title {
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stage-builder__step-description {
    margin-top: 4px;
    overflow: hidden;
    color: $color-text-subtle;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stage-builder__progress-line {
    height: 4px;
    overflow: hidden;
    border-radius: 999px;
    background: $color-surface-muted;
  }

  .stage-builder__progress-fill {
    height: 100%;
    border-radius: inherit;
    background: $color-primary;
    transition: width 0.2s ease;
  }

  .stage-builder__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    flex-wrap: nowrap;
    padding: 10px 12px;
    border: 1px solid $color-border-default;
    border-radius: 10px;
    background: $color-surface;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  }
</style>
