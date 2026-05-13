<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    :title="title"
    :closable="true"
    :mask-closable="true"
  >
    <div class="modal-content">
      <n-input
        v-model:value="email"
        type="text"
        :input-props="{ type: 'email', autocomplete: 'email' }"
        :placeholder="placeholder"
        clearable
        @keyup.enter="onInviteClick"
      />

      <div class="modal-footer">
        <n-button type="primary" :disabled="!canInvite" @click="onInviteClick" :color="'#2f9acc'">
          Пригласить
        </n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { NModal, NInput, NButton } from 'naive-ui'

  const show = defineModel<boolean>('show', { required: true })

  const props = withDefaults(
    defineProps<{
      title?: string
      placeholder?: string
    }>(),
    {
      title: 'Пригласить пользователя',
      placeholder: 'Электронная почта',
    }
  )

  const emit = defineEmits<{
    invite: [email: string]
  }>()

  const email = ref('')

  const trimmedEmail = computed(() => email.value.trim())

  const canInvite = computed(() => trimmedEmail.value.length > 0)

  function onInviteClick() {
    if (!canInvite.value) return
    emit('invite', trimmedEmail.value)
  }

  watch(show, visible => {
    if (!visible) {
      email.value = ''
    }
  })
</script>

<style scoped>
  .modal-content {
    padding: 8px 0 4px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
</style>
