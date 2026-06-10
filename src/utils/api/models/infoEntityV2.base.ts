import type { TreeNodes } from '@/src/components/Ui/Tree/types'

// #region Actions
export interface IActionButton {
  title: string
  code: string
  size: 'small' | 'medium' | 'large'
}

export interface IActionLogicButton extends IActionButton {
  type: 'logic'
}

export interface IActionDirectButton extends IActionButton {
  type: 'directRequest'
  requestUrl: string
}

export type IBlockAction = IActionLogicButton | IActionDirectButton

// #endregion

// #region Blocks
export interface ITreeBlock extends IBlock {
  blockType: 'tree'
}

export interface ITableBlock extends IBlock {
  columnCapacity: number
  maxColumns: number
  blockType: 'table'
}

export interface IAnalyticBlock extends IBlock {
  blockType: 'analytics'
}

export interface IMetricBlock extends IBlock {
  blockType: 'metrics'
  tableUrl: string
  tableColumns: {
    key: string
    title: string
    path: string
  }[]
  entityUrl: string
  entityActions?: IBlockAction[]
}

export interface IBlock {
  code: string
  name: string
  actions?: { title: string; code: string; size: 'small' | 'medium' | 'large'; blockCode: string }[]
  /**
   * Добавление
   *
   * При добавлениии блок будет скрыт
   */
  createHide?: true
}

export type TEntityBlock = ITreeBlock | ITableBlock | IAnalyticBlock | IMetricBlock
// #endregion

export interface IField {
  title: string
  editable: boolean
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'constants'
  path: string
  editPath?: string
  selectUrl?: string

  // Поля для добаления
  required?: true // Обязательно заполнение при добавлении
  createEditable?: boolean // При добавлении можно ли менять. Перекрывает editable
  createDefault?: boolean | string | number // При добавлении дефолтное значение. Если поле только для отображение (editable: false) то можно добавить дефолтное значение
}

export interface IBlockIndentifier {
  blockCode: string
}

export interface IBlockDetail extends IBlockIndentifier {
  fields: IField[]
}

export interface IBlockTreeDetail extends IBlockIndentifier {
  treePath: string
}

export interface Data {
  [key: string]: unknown
}

export interface Tree {
  nodes: TreeNodes
  checkable?: boolean
  cascade?: boolean
}

export interface IEntity {
  blocks: TEntityBlock[]
  blockDetails: (IBlockDetail | IBlockTreeDetail)[]
  data: Data
}
