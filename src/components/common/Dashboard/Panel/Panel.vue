<template>
  <div ref="panelsWrapperRef" class="panels-wrapper">
    <div class="panel-container" :style="{ width: panelOpened ? '220px' : '50px' }">
      <div
        class="panel-item"
        :class="panelOpened ? 'panel-arrow-close' : ''"
        @click="panelOpened = !panelOpened"
      >
        <img src="/icons/leftToRightArrow.png" width="30" height="30" />
      </div>
      <div class="panel-content" :class="{ 'panel-content-opened': panelOpened }">
        <div v-for="block in panelBlocks" :key="block.key" class="panel-content-block">
          <PanelItem
            v-for="item in block.items"
            :key="item.id"
            :item="item"
            :label-visible="panelOpened"
            :is-active="selectedMainPanelItem === item"
            @click="onMainItemClick(item)"
          />
        </div>
      </div>
    </div>
    <div v-if="selectedMainPanelItem" class="panel-container" :style="{ width: '220px' }">
      <div class="panel-content panel-content-opened">
        <div class="panel-content-block">
          <PanelItem
            v-for="sub in selectedMainPanelItem.children"
            :key="sub.id"
            :item="sub"
            :label-visible="true"
            @click="onSubItemClick(sub)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onClickOutside } from '@vueuse/core'
  import PanelItem from './PanelItem.vue'
  import accountIcon from '/icons/account.png'
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useProjectStore } from '@/src/store/project'

  type TPanelItem = {
    id: number
    code?: number | string
    name: string
    icon?: string
    url?: string
    children?: TPanelItem[]
  }

  const router = useRouter()
  const panelOpened = ref(false)
  const panelsWrapperRef = ref(null)
  const selectedMainPanelItem = ref<TPanelItem | null>(null)

  const project = useProjectStore()

  const panelBlocks = computed(() => {
    return [
      { key: 'first', items: project.panel },
      {
        key: 'second',
        items: [{ id: 3, name: 'Аккаунт', icon: accountIcon, url: '/account' }],
      },
    ]
  })

  const onMainItemClick = (item: TPanelItem) => {
    const isSelectedItem = selectedMainPanelItem.value === item

    if (isSelectedItem) {
      closePanel()
      return
    }

    if (item?.children?.length) {
      selectedMainPanelItem.value = item
      return
    }

    if (item.url) {
      router.push(item.url)
      closePanel()
    }
  }

  const onSubItemClick = (item: TPanelItem) => {
    if (item.url) {
      router.push(item.url)
      closePanel()
    }
  }

  onClickOutside(panelsWrapperRef, () => {
    closePanel()
  })

  const closePanel = () => {
    selectedMainPanelItem.value = null
  }
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
