<template>
  <n-modal-provider>
    <n-dialog-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-modal-provider>
</template>

<script>
import './style.css'
</script>

<style lang="css">
#app {
  height: 100%;
  width: 100%;
}
</style>