<template>
  <div class="panels-wrapper">
    <div
      class="panel-container"
      :style="{ width: panelOpened ? '220px' : '50px' }"
    >
      <div
        class="panel-item"
        :class="panelOpened ? 'panel-arrow-close' : ''"
        @click="panelOpened = !panelOpened"
      >
        <img src="/icons/leftToRightArrow.png" width="30" height="30" />
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
          <PanelItem
            v-for="item in block.items"
            :key="item.id"
            :item="item"
            :is-hover="hoverId === item.id"
            :label-visible="panelOpened"
            @click="onItemClick(item)"
            @mouseenter="hoverId = item.id"
            @mouseleave="hoverId = null"
          />
        </div>
      </div>
    </div>
    <div
      v-if="subPanelItem"
      class="panel-container"
      :style="{ width:  '220px' }"
    >
      <div
        class="panel-content panel-content-opened"
      >
        <div class="panel-content-block">
          <PanelItem
            v-for="sub in subPanelItem.children"
            :key="sub.id"
            :item="sub"
            :is-hover="subHoverId === sub.id"
            @click="onItemClick(sub)"
            @mouseenter="subHoverId = sub.id"
            @mouseleave="subHoverId = null"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PanelItem from './PanelItem.vue'
import marketingIcon from '/icons/marketing.png'
import projectIcon from '/icons/project.png'
import accountIcon from '/icons/account.png'
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {useProjectStore} from '@/src/store/project'

const router = useRouter()
const route = useRoute()
const panelOpened = ref(false)
const subPanelItem = ref(null)
const hoverId = ref(null)
const subHoverId = ref(null)

const project = useProjectStore()

const panelItems = ref({
  first: [
    { 
      id: 1,
      name: 'Маркетинг',
      icon: marketingIcon,
      children: [
        { id: 11, name: 'Стратегии', path: '/'},
        { id: 12, name: 'Каналы трафика', path: '/'},
        { id: 13, name: 'Результаты трафика', path: '/'},
      ]
    },
    {
      id: 2,
      name: 'Проект',
      icon: projectIcon,
      children: [
        { id: 21, name: 'Разработчику', path: '/' },
        { id: 22, name: 'Апи ключи', path: '/' },
        { id: 23, name: 'Пользователи', path: '/' },
      ],
    },
  ],
  second: [
    { id: 3, name: 'Аккаунт', icon: accountIcon, path: '/account' },
  ],
})

const panelBlocks = computed(() => {  
  return [
    { key: 'first', items: project.isSelected ? panelItems.value.first : [] },
    { key: 'second', items: panelItems.value.second },
  ]
})


function onItemClick(item) {
  if (item.path) {
    router.push(item.path)
    subPanelItem.value = null
  } else if (item?.children?.length) {
    subPanelItem.value = subPanelItem.value?.id === item.id ? null : item
  }
}

watch(panelOpened, (open) => { if (!open) subPanelItem.value = null })
</script>

<style lang="css">
.panels-wrapper {
  display: flex;
  height: 100%;
}
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

.panel-content-opened {
  align-items: start;
}

.panel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  cursor: pointer;
  transition: background 0.15s;
}

.panel-arrow-close {
  transform: rotate(180deg);
  justify-content: left;
  padding-left: 10px;
}
</style>
