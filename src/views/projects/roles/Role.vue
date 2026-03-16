<template>
  <InfoDataEntity
    :fetch-data-req="async () => roleApi.getTableById(roleId)"
  />
</template>

<script setup>
import InfoDataEntity from '@/src/components/layout/InfoDataEntity/InfoDataEntity.vue';
import roleApi from '@/src/utils/api/role';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const roleId = computed(() => route.params.id)
</script>
