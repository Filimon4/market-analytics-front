<template>
  <InfoDataTable
    :redirect-entity-url="'roles'"
    :fetchDataReq="roleApi.getTableList"
    :default-page-size="10"
    :actions="actions"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import type { Action } from '@/src/components/layout/CustomDataTable/CustomDataTable.type'
  import InfoDataTable from '@/src/components/layout/InfoDataTable/InfoDataTable.vue'
  import roleApi from '@/src/utils/api/role'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const actions: Action[] = [
    {
      code: 'addRole', // TODO: Нужно добавить страницу содания сущности. То есть с бэка должна приходить пустые филды и блоки на создание и на фронте создание с сохранением и переадресацией на готовую страницу со сущностью
      size: 'medium',
      title: 'Добавить роль',
    },
  ]

  const handleClickAction = (code: string) => {
    if (code == 'addRole') {
      router.push('roles/create')
    }
  }
</script>
