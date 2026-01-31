<template>
  <div
    class="panel-item-container panel-item-container--opened"
    :class="{
      'panel-item-container--active': isActive,
    }"
  >
    <div
      class="panel-item"
      @click="$emit('click')"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave')"
    >
      <img
        v-if="item.icon"
        :src="item.icon"
        width="30"
        height="30"
        alt=""
      >
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
  labelVisible: { type: Boolean, default: false },
})
defineEmits(['click', 'mouseenter', 'mouseleave'])
</script>

<style lang="css" scoped>

.panel-item-container {
  width: 100%;
}
.panel-item-container:hover {
  background: rgba(255, 255, 255, 0.1);
}
.panel-item-container--active {
  background: rgba(255, 255, 255, 0.2);
}
.panel-item-container--opened {
  .panel-item {
    justify-content: start;
    gap: 10px;
    color: white;
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
