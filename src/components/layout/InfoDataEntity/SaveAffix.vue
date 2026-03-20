<template>
  <Affix :bottom="'10px'" :right="'50%'" :transform="'translateX(50%)'">
    <div class="entity-submit">
      <n-button type="primary" :loading="saving" @click="emit('save')" color="#2f9acc">
        Сохранить
      </n-button>
      <n-button @click="emit('cancel')" color="#7c7c7cc0">Отмена</n-button>
    </div>
  </Affix>
</template>

<script setup lang="ts">
  import Affix from '../../common/affix/Affix.vue'

  const saving = defineModel<boolean>('saving', { required: true, default: false })

  const emit = defineEmits<{
    (e: 'save'): void
    (e: 'cancel'): void
  }>()
</script>

<style scoped>
  .entity-submit {
    display: flex;
    gap: 10px;
    flex-wrap: nowrap;
  }
</style>
