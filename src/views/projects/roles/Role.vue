<template>
  <InfoDataEntity
    :fetch-data-req="async () => roleApi.getTableById(roleId)"
    :save-data-req="async (data: IEntity['data']) => roleApi.saveRole(data)"
    :actions="actions"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import type {
    Action,
    IEntity,
  } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import roleApi from '@/src/utils/api/role'
  import { useDialog } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const dialog = useDialog()

  const router = useRouter()
  const route = useRoute()

  const roleId = computed(() => Number(route.params.id))

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
    }
  }
</script>
