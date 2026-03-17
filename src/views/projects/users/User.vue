<template>
  <InfoDataEntity
    :fetch-data-req="async () => userApi.getTableById(userId)"
  />
</template>

<script setup>
import InfoDataEntity from '@/src/components/layout/InfoDataEntity/InfoDataEntity.vue';
import userApi from '@/src/utils/api/user/index';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const userId = computed(() => route.params.id)
</script>
