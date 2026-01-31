<template>
  <div
    class="panel-container"
    :style="{width: panelOpened ? '200px' : '50px'}"
  >
    <div 
      class="panel-item"
      :class="panelOpened ? 'panel-arrow-close' : ''"
      @click="panelOpened = !panelOpened"
    >
      <img src="/public/icons/leftToRightArrow.png" width="30" height="30" />
    </div>
    <div
      class="panel-content"
      :class="{ 'panel-content-opened': panelOpened }"
    >
      <div
        v-for="block in panelBlocks"
        :key="block.key"
        class="panel-content-block"
      >
        <div
          v-for="item in block.items"
          :key="item.id"
          class="panel-item"
        >
          <img :src="item.icon" width="30" height="30" alt="" />
          <span v-if="panelOpened">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import marketingIcon from '/icons/marketing.png'
import projectIcon from '/icons/project.png'
import accountIcon from '/icons/account.png'
import { ref, computed } from 'vue'

const activeItem = ref(1)
const panelOpened = ref(false)

const panelItems = ref({
  first: [
    { id: 1, name: 'Маркетинг', icon: marketingIcon },
    { id: 2, name: 'Проект', icon: projectIcon },
  ],
  second: [
    { id: 3, name: 'Аккаунт', icon: accountIcon },
  ],
})

const panelBlocks = computed(() => [
  { key: 'first', items: panelItems.value.first },
  { key: 'second', items: panelItems.value.second },
])

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
  width: 100%;
}

.panel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: 100%;
  height: 40px;
}

.panel-content-opened {
  align-items: start;
  padding-left: 10px;

  .panel-item {
    justify-content: start;
    gap: 10px;
    color: white;
    font-size: 20px;
  }
}

.panel-arrow-close {
  transform: rotate(180deg);
  justify-content: left;
  padding-left: 10px;
}
</style>
