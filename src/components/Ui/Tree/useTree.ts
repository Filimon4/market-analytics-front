import type { TreeNode } from './types'

export function useTree(options: { cascade?: boolean; checkable?: boolean }) {
  const getAllDescendants = (node: TreeNode): TreeNode[] => {
    const descendants: TreeNode[] = []
    if (node.children?.length) {
      node.children.forEach(child => {
        descendants.push(child)
        descendants.push(...getAllDescendants(child))
      })
    }
    return descendants
  }

  const updateCheckedState = (node: TreeNode, checked: boolean) => {
    if (node.disabled) return

    node.checked = checked

    if (options.cascade) {
      const descendants = getAllDescendants(node)
      descendants.forEach(desc => {
        if (!desc.disabled) desc.checked = checked
      })

      updateParents(node)
    }
  }

  const updateParents = (node: TreeNode) => {
    while (node) {
      if (!node.children?.length) break

      const allChildren = node.children
      const checkedChildren = allChildren.filter(c => c.checked)
      const indeterminateChildren = allChildren.some(
        c => c.checked === undefined || (c.children && hasIndeterminate(c))
      )

      if (checkedChildren.length === allChildren.length) {
        node.checked = true
      } else if (checkedChildren.length > 0 || indeterminateChildren) {
        node.checked = false
      } else {
        node.checked = false
      }

      break
    }
  }

  const hasIndeterminate = (node: TreeNode): boolean => {
    if (!node.children) return false
    return node.children.some(child => child.checked === false && hasAnyChecked(child))
  }

  const hasAnyChecked = (node: TreeNode): boolean => {
    if (node.checked) return true
    return node.children?.some(child => hasAnyChecked(child)) ?? false
  }

  const toggleNode = (node: TreeNode) => {
    if (!options.checkable) return

    const newChecked = !node.checked
    updateCheckedState(node, newChecked)
  }

  return {
    toggleNode,
    getAllDescendants,
  }
}
