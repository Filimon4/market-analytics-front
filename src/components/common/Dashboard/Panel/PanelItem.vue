<template>
  <div
    class="panel-item-container panel-item-container--opened"
    :class="{ 'panel-item-container--active': isActive }"
  >
    <div
      class="panel-item"
      @click="$emit('click')"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave')"
    >
      <img v-if="item.icon" :src="item.icon" width="30" height="30" alt="" />
      <span v-if="labelVisible">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    item: { type: Object, required: true },
    labelVisible: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
  })
  defineEmits(['click', 'mouseenter', 'mouseleave'])
</script>

<style lang="scss" scoped>
  .panel-item-container {
    width: 100%;
  }
  .panel-item-container:hover {
    background: $color-surface-panel-hover;
  }
  .panel-item-container--active {
    background: $color-surface-panel-active;
  }
  .panel-item-container--opened {
    .panel-item {
      justify-content: start;
      gap: 10px;
      color: $color-white;
      font-size: 20px;
      padding-left: 10px;
    }
  }

  .panel-item {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    width: 100%;
    height: 40px;

    cursor: pointer;
    transition: background 0.15s;
  }
</style>
