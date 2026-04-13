<template>
  <n-config-provider :locale="ruLocale" :date-locale="dateRuRU">
    <n-modal-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-dialog-provider>
    </n-modal-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
  import { ruRU, dateRuRU } from 'naive-ui'
  import './style.css'

  const ruLocale = {
    ...ruRU,
  }
</script>

<style lang="css">
  #app {
    height: 100%;
    width: 100%;
  }

  .n-config-provider {
    height: 100%;
  }
</style>
