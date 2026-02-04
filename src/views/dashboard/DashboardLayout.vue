<template>
  <div class="dashboard-container">
    <Panel />
    <div class="dashboard-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Panel from '@/src/components/dashboard/panel/Panel.vue';
</script>

<style lang="css" scoped>
.dashboard-container {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>