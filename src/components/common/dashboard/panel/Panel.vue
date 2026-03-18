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
      ref="subPanelRef"
      class="panel-container"
      :style="{ width: '220px' }"
    >
      <div class="panel-content panel-content-opened">
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
import { onClickOutside } from "@vueuse/core";
import PanelItem from "./PanelItem.vue";
import marketingIcon from "/icons/marketing.png";
import projectIcon from "/icons/project.png";
import accountIcon from "/icons/account.png";
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProjectStore } from "@/src/store/project";

const router = useRouter();
const route = useRoute();
const panelOpened = ref(false);
const subPanelRef = ref(null);
const subPanelItem = ref(null);
const hoverId = ref(null);
const subHoverId = ref(null);

const project = useProjectStore();

const panelBlocks = computed(() => {
  return [
    { key: "first", items: project.panel },
    {
      key: "second",
      items: [{ id: 3, name: "Аккаунт", icon: accountIcon, url: "/account" }],
    },
  ];
});

function onItemClick(item) {
  if (item.url) {
    router.push(item.url);
    subPanelItem.value = null;
  } else if (item?.children?.length) {
    subPanelItem.value = item;
  }
}

watch(panelOpened, (open) => {
  if (!open) subPanelItem.value = null;
});

onClickOutside(subPanelRef, () => {
  subPanelItem.value = null;
});
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
