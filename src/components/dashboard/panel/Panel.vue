<template>
  <div
    class="panel-container"
    :style="{width: panelOpened ? '100px' : '50px'}"
  >
    <div 
      class="panel-item"
      @click="panelOpened = !panelOpened"
      :style="{
        transform: panelOpened ? 'rotate(180deg)' : null,
        justifyContent: panelOpened ? 'left' : 'center'
      }"
    >
      <img class="panel-arrow"  src="/public/icons/leftToRightArrow.png" width="30" height="30" />
    </div>
    <div v-if="!panelOpened" class="panel-content">
      <div class="panel-content-block">
        <div v-for="(item, index) in panelItems.first" :key="index" class="panel-item">
          <img :src="item.icon" width="30" height="30" alt="" />
        </div>
      </div>
      <div class="panel-content-block">
        <div v-for="(item, index) in panelItems.second" :key="index" class="panel-item">
          <img :src="item.icon" width="30" height="30" alt="" />
        </div>
      </div>
    </div>
    <div v-if="panelOpened" class="panel-content-opened">

    </div>
  </div>
</template>

<script setup>
import marketingIcon from '/icons/marketing.png'
import projectIcon from '/icons/project.png'
import accountIcon from '/icons/account.png'
import { ref } from 'vue'

const activeItem = ref(1)
const panelOpened = ref(false)

const panelItems = ref({
  first: [
    {
      id: 1,
      name: 'Маркетинг',
      icon: marketingIcon
    },
    {
      id: 2,
      name: 'Проект',
      icon: projectIcon
    },
  ],
  second: [
    {
      id: 3,
      name: "Аккаунт",
      icon: accountIcon
    }
  ]
})

</script>

<style lang="css">
.panel-container {
  display: flex;
  flex-direction: column;
  
  height: 100%;
  
  background-color: gray;
}

.panel-content {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  padding-block: 10px;

  height: 100%;
}

.panel-content-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.panel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  
  height: 40px;
}

.panel-content-opened {
  width: 100px;
}
</style>
