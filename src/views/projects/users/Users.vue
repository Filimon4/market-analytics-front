<template>
  <InfoDataTable
    :redirect-entity-url="'users'"
    :fetchDataReq="userApi.getTableList"
    :default-page-size="10"
    :actions="actions"
    @click:action="handleAction"
  />
  <InviteModal v-model:show="showInviteModal" @invite="onInviteUser" />
</template>

<script setup lang="ts">
  import type { Action } from '@/src/components/Layout/CustomDataTable/CustomDataTable.type'
  import InfoDataTable from '@/src/components/Layout/InfoDataTable/InfoDataTable.vue'
  import InviteModal from '@/src/components/Ui/InviteModal/InviteModal.vue'
  import invitationApi from '@/src/utils/api/invitation'
  import userApi from '@/src/utils/api/user'
  import { useMessage } from 'naive-ui'
  import { ref } from 'vue'

  const message = useMessage()
  const showInviteModal = ref(false)

  const actions = ref<Action[]>([
    {
      code: 'inviteUser',
      size: 'medium',
      title: 'Пригласить пользователя',
    },
  ])

  const handleAction = async (code: string) => {
    if (code == 'inviteUser') {
      showInviteModal.value = true
    }
  }

  const onInviteUser = async (email: string) => {
    const inviteResult = await invitationApi.create(email).catch(() => null)

    if (inviteResult) {
      message.success('Успешно отправлено приглашение')
    }

    showInviteModal.value = false
  }
</script>
