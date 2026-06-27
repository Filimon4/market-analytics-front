export interface StageBuilderStage {
  code: string
  title: string
  description?: string
  slot?: string
  hidden?: boolean
  disableBack?: boolean
  disableNext?: boolean
}

export interface StageBuilderSlotProps {
  stage: StageBuilderStage | undefined
  stageIndex: number
  isFirst: boolean
  isLast: boolean
  canGoBack: boolean
  canGoNext: boolean
  progress: number
  stages: StageBuilderStage[]
  back: () => void
  next: () => void
  goTo: (stageCode: string) => void
}
