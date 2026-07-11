<template>
  <div
    class="panel-item-container"
    :class="{
      'panel-item-container--opened': labelVisible,
      'panel-item-container--active': isActive,
    }"
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
    border-radius: 10px;
  }

  .panel-item-container--active {
    background: $color-surface-blue-hover;

    .panel-item {
      color: $color-primary;
      font-weight: 600;
    }
  }

  .panel-item-container--opened {
    .panel-item {
      justify-content: start;
      gap: 10px;
      font-size: 15px;
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
    border-radius: 10px;

    color: $color-text-subtle;
    cursor: pointer;
  }

  .panel-item:hover {
    background: $color-surface-hover;
    color: $color-text-primary;
  }

  .panel-item img {
    filter: brightness(0) saturate(100%);
  }

  .panel-item-container--active .panel-item:hover {
    background: $color-surface-blue-hover;
  }
</style>
