<template>
  <div class="dashboard-container">
    <Panel />
    <div class="dashboard-content">
    </div>
  </div>
</template>

<script setup>
import Panel from '@/src/components/dashboard/panel/Panel.vue';
import { ref } from 'vue';

const feature = ref();
</script>

<style lang="css" scoped>
.dashboard-content {
  
}

.dashboard-container {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>