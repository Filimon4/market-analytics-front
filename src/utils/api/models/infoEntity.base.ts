import type { TreeNodes } from '@/src/components/Ui/Tree/types'

export interface IBlockIndentifier {
  blockCode: string
}

export interface IBlock {
  name: string
  code: string
  columnCapacity: number
  maxColumns: number
  blockType: 'table' | 'tree' | 'analytics' | 'metrics'

  // Поля для добавления
  createHide?: true // При добавлениии блок будет скрыт
}

export interface IField {
  title: string
  editable: boolean
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'constants' | 'formula'
  path: string
  editPath?: string

  /**
   * Поле для formula
   *
   * Получение данных для формулы
   */
  formulaOperatorsUrl?: string
  /**
   * Поле для select
   *
   * Получение данных для выбора
   */
  selectUrl?: string

  /**
   * Поле для добаления
   *
   * Обязательно заполнение при добавлении
   */
  required?: true
  /**
   * Поле для добаления
   *
   * При добавлении можно ли менять. Перекрывает editable
   */
  createEditable?: boolean
  /**
   * Поле для добаления
   *
   * При добавлении дефолтное значение. Если поле только для отображение (editable: false) то можно добавить дефолтное значение
   * */
  createDefault?: boolean | string | number
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
  blocks: IBlock[]
  blockDetails: (IBlockDetail | IBlockTreeDetail)[]
  data: Data
}
