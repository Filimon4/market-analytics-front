<template>
  <n-result
    status="404"
    title="404 - Page Not Found"
    description="The page you're looking for doesn't exist."
    class="not-found"
  >
    <template #footer>
      <n-space justify="center">
        <n-button type="primary" tag="a" href="/"> Go to Dashboard </n-button>
        <n-button @click="$router.go(-1)"> Go Back </n-button>
      </n-space>
    </template>
  </n-result>
</template>

<script setup lang="ts">
  import { NResult, NButton, NSpace } from 'naive-ui'
</script>

<style scoped>
  .not-found {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
