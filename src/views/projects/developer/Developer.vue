<template>
  <div class="openApi">
    <div></div>
    <iframe :src="apiDocsUrl" class="openApi" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const apiDocsUrl = ref(`${import.meta.env.VITE_API_BASE_URL}/open-crm-api`)
</script>

<style>
  .openApi {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>
