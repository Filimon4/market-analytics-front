<template>
  <n-message-provider>
    <router-view />
  </n-message-provider>
</template>

<script>
import { useUserStore } from './store/user';
import './style.css'
import userApi from './utils/api/user';

const user = useUserStore()

user.setProjectId()

</script>

<style lang="css">
#app {
  height: 100%;
  width: 100%;
}
</style>