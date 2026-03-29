<template>
  <InfoDataEntity
    :fetch-data-req="async () => roleApi.getTableById(roleId)"
    :actions="[
      {
        title: 'Удалить',
        blockCode: 'main',
        code: 'deleteRole',
        size: 'medium',
      },
    ]"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataEntity from '@/src/components/layout/InfoDataEntity/InfoDataEntity.vue'
  import roleApi from '@/src/utils/api/role'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  const roleId = computed(() => Number(route.params.id))

  const handleClickAction = async (action: string) => {
    if (action == 'deleteRole') {
      const response = await roleApi.deleteRole(roleId.value)
      if (response) {
        router.back()
      }
    }
  }
</script>
