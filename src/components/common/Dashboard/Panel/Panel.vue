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
          <template v-if="block.items.length">
            <PanelItem
              v-for="item in block.items"
              :key="item.id"
              :item="item"
              :label-visible="panelOpened"
              :is-active="selectedMainPanelItem === item"
              @click="onMainItemClick(item)"
            />
          </template>
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
      { key: 'first', items: (project.panel || []) as TPanelItem[] },
      {
        key: 'second',
        items: [{ id: 3, name: 'Аккаунт', icon: accountIcon, url: '/' }] as TPanelItem[],
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

<style lang="scss">
  .panels-wrapper {
    display: flex;
    align-items: stretch;
    gap: 12px;
    height: 100%;
    padding: 12px;
    box-sizing: border-box;
  }

  .panel-container {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 100%;
    background-color: $color-surface;
    border: 1px solid $color-border-light;
    border-radius: 14px;
    box-shadow: 0px 2px 10px $color-shadow-default;
    overflow: hidden;
  }

  .panel-content {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;

    padding: 10px 8px;

    height: 100%;
    box-sizing: border-box;
  }

  .panel-content-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 100%;
  }

  .panel-content-block + .panel-content-block {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid $color-border-light;
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
    border-radius: 10px;
    cursor: pointer;
    color: $color-text-subtle;
    transition:
      background 0.15s,
      color 0.15s;
  }

  .panel-item:hover {
    background: $color-surface-hover;
    color: $color-text-primary;
  }

  .panel-container > .panel-item {
    width: calc(100% - 16px);
    margin: 8px auto 0;
    border-bottom: 1px solid $color-border-light;
    border-radius: 10px 10px 0 0;
  }

  .panel-arrow-close {
    transform: rotate(180deg);
    justify-content: left;
    padding-left: 10px;
  }

  .panel-item img {
    filter: brightness(0) saturate(100%);
  }
</style>
