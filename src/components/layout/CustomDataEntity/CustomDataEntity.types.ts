import type { TreeOptions } from 'naive-ui/es/tree/src/interface'

export interface IBlockIndentifier {
  blockCode: string
}

export interface IBlock {
  name: string
  code: string
  columnCapacity: number
  maxColumns: number
  blockType: 'table' | 'tree'

  // Поля для добавления
  createHide?: true // При добавлениии блок будет скрыт
}

export interface IField {
  title: string
  editable: boolean
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select'
  path: string
  editPath?: string
  selectUrl?: string

  // Поля для добаления
  required?: true // Обязательно заполнение при добавлении
  createEditable?: true // При добавлении можно ли менять. Перекрывает editable
  createDefault?: boolean | string | number // При добавлении дефолтное значение. Если поле только для отображение (editable: false) то можно добавить дефолтное значение
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

export interface IEntity {
  blocks: IBlock[]
  blockDetails: (IBlockDetail | IBlockTreeDetail)[]
  data: Data
}

export interface Action {
  title: string
  code: string
  size: 'small' | 'medium' | 'large'
  blockCode: string
}

export interface Tree {
  nodes: TreeOptions
  defaultCheckedKeys?: string[]
  checkable?: boolean
  draggable?: boolean
}
