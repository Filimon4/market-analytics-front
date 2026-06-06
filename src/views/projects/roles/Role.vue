<template>
  <InfoDataEntity
    v-model="triggerUpdate"
    :fetch-data-req="async () => roleApi.getTableById(roleId)"
    :save-data-req="roleApi.saveRole"
    :actions="actions"
    @click:action="handleClickAction"
  />

  <AddPermissionsModal
    v-model:show="showAddPermissionsModal"
    :role-id="roleId"
    @added="onPermissionsAdded"
  />
</template>

<script setup lang="ts">
  import type { Action } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import AddPermissionsModal from '@/src/components/Ui/AddPermissionsModal/AddPermissionsModal.vue'
  import roleApi from '@/src/utils/api/role'
  import { useDialog } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const dialog = useDialog()

  const router = useRouter()
  const route = useRoute()

  const roleId = computed(() => Number(route.params.id))
  const showAddPermissionsModal = ref(false)
  const triggerUpdate = ref(false)

  const actions = ref<Action[]>([
    {
      title: 'Востановить',
      blockCode: 'main',
      code: 'restore',
      size: 'medium',
    },
    {
      title: 'Удалить',
      blockCode: 'main',
      code: 'delete',
      size: 'medium',
    },
    {
      title: 'Добавить доступы',
      blockCode: 'permissions',
      code: 'addPermission',
      size: 'medium',
    },
  ])

  const handleClickAction = async (action: string) => {
    if (action == 'delete') {
      const react = await new Promise(res =>
        dialog.warning({
          title: 'Подтверждение',
          content: 'Хотите удалить роль',
          positiveText: 'Да',
          negativeText: 'Нет',
          draggable: true,
          onPositiveClick: () => {
            res(true)
          },
          onNegativeClick: () => {
            res(false)
          },
        })
      )

      if (!react) return

      const response = await roleApi.deleteRole(roleId.value)
      if (response) {
        router.back()
      }
    } else if (action === 'restore') {
      const react = await new Promise(res =>
        dialog.warning({
          title: 'Подтверждение',
          content: 'Хотите востановить роль',
          positiveText: 'Да',
          negativeText: 'Нет',
          draggable: true,
          onPositiveClick: () => {
            res(true)
          },
          onNegativeClick: () => {
            res(false)
          },
        })
      )

      if (!react) return

      await roleApi.restoreRole(roleId.value)
    } else if (action === 'addPermission') {
      showAddPermissionsModal.value = true
    }
  }

  function onPermissionsAdded() {
    triggerUpdate.value = true
  }
</script>
