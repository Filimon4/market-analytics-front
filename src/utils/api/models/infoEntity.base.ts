import type { TreeNodes } from '@/src/components/Ui/Tree/types'

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
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'constants'
  path: string
  editPath?: string
  selectUrl?: string

  // Поля для добаления
  required?: true // Обязательно заполнение при добавлении
  createEditable?: boolean // При добавлении можно ли менять. Перекрывает editable
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
