<template>
  <n-tree
    :data="treeData"
    key-field="key"
    label-field="label"
    style="width: 100%"
  />
</template>

<script setup lang="ts">
  import { NTree } from 'naive-ui'
  import { computed } from 'vue'

  const props = defineProps<{
    fields: any[]
    data: any
  }>()

  const treeData = computed(() => {
    const fields = props.fields
    if (!fields.length) return []

    const rootChildren: any[] = []
    const nodeMap = new Map<string, any>()

    const getValue = (path: string) =>
      path.split('.').reduce((obj: any, key: string) => obj?.[key], props.data)

    for (const field of fields) {
      const parts = field.path.split('.')
      let currentLevel = rootChildren
      let currentPath = ''

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        currentPath = currentPath ? `${currentPath}.${part}` : part
        const isLeaf = i === parts.length - 1

        let node = nodeMap.get(currentPath)
        if (!node) {
          node = {
            key: currentPath,
            label: isLeaf ? `${field.title}: ${getValue(field.path) ?? '—'}` : part,
            children: isLeaf ? undefined : []
          }
          if (isLeaf) node.isLeaf = true
          nodeMap.set(currentPath, node)
          currentLevel.push(node)
        }

        if (!isLeaf) {
          currentLevel = node.children!
        } else {
          node.label = `${field.title}: ${getValue(field.path) ?? '—'}`
        }
      }
    }
    return rootChildren
  })
</script>

<style scoped>
  :deep(.n-tree) {
    font-size: 0.95em;
  }

  @media (max-width: 900px) {
    .block-content.tree-view {
      flex-direction: unset;
    }
  }
</style>