<template>
  <div class="dashboard-container">
    <Panel />
    <div class="dashboard-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Panel from '@/src/components/common/dashboard/panel/Panel.vue';
</script>

<style lang="css" scoped>
.dashboard-container {
  height: 100%;
  width: 100%;
  display: flex;
}

.dashboard-content {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>