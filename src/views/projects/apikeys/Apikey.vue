<template>
  <InfoDataEntity
    :fetch-data-req="async () => apiKeysApi.getTableById(apiKeyId)"
  />
</template>

<script setup>
import InfoDataEntity from '@/src/components/layout/InfoDataEntity/InfoDataEntity.vue';
import apiKeysApi from '@/src/utils/api/apikeys';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const apiKeyId = computed(() => route.params.id)
</script>
