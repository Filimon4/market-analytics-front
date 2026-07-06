<template>
  <n-result
    status="404"
    title="404 - Page Not Found"
    description="The page you're looking for doesn't exist."
    class="not-found"
  >
    <template #footer>
      <n-space justify="center">
        <n-button type="primary" tag="a" href="/"> Вернутся на главную </n-button>
        <n-button @click="router.back()"> Назад </n-button>
      </n-space>
    </template>
  </n-result>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { NResult, NButton, NSpace } from 'naive-ui'

  const router = useRouter()
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
