export interface TreeNode {
  key: string | number
  label: string
  checked?: boolean
  icon?: string
  children?: TreeNode[]
  disabled?: boolean
  [key: string]: unknown
  isLeaf?: boolean
}

export type TreeNodes = TreeNode[]

export type TreeEmits = {
  'update:modelValue': [value: TreeNode[]]
  'node:click': [node: TreeNode]
}
