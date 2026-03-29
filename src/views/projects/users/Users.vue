<template>
  <InfoDataTable
    :redirect-entity-url="'users'"
    :fetchDataReq="userApi.getTableList"
    :default-page-size="10"
    :actions="[
      {
        code: 'inviteUser', // TODO: Нужно реализовать систему приглашений. Скорее всего нужно добавить собития (нотификации) для клиенат и для проекта
        size: 'medium',
        title: 'Пригласить пользователя',
      },
    ]"
    @click:action="handleAction"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/layout/InfoDataTable/InfoDataTable.vue'
  import userApi from '@/src/utils/api/user'

  const handleAction = async () => {}
</script>
