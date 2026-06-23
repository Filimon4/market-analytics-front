<template>
  <select-list-modal
    v-model:show="show"
    title="Добавить доступы"
    confirm-text="Добавить"
    empty-text="Нет доступных разрешений"
    :fetch-items="loadPermissions"
    :filter-items="filterPermissions"
    :confirm-loading="submitting"
    :reload-on-search="false"
    :close-on-confirm="true"
    @confirm="confirm"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import SelectListModal from '@/src/components/Ui/SelectListModal/SelectListModal.vue'
  import type {
    ISelectListFetchContext,
    ISelectListItem,
    SelectListItemId,
  } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import roleApi from '@/src/utils/api/role'

  const show = defineModel<boolean>('show', { required: true })

  const props = defineProps<{
    roleId: number
  }>()

  const emit = defineEmits<{
    added: []
  }>()

  const message = useMessage()

  const submitting = ref(false)

  async function loadPermissions() {
    return roleApi.getNewPermissionsForRole(props.roleId)
  }

  function filterPermissions(items: ISelectListItem[], context: ISelectListFetchContext) {
    const term = context.search.toLowerCase()
    if (!term) return items

    return items.filter(
      item =>
        item.code?.toLowerCase().includes(term) ||
        (item.description?.toLowerCase().includes(term) ?? false)
    )
  }

  async function confirm(_items: ISelectListItem[], selectedIds: SelectListItemId[]) {
    submitting.value = true
    try {
      await roleApi.addNewPermissionsToRole(props.roleId, selectedIds.map(Number))
      message.success('Доступы успешно добавлены')
      emit('added')
    } finally {
      submitting.value = false
    }
  }
</script>
