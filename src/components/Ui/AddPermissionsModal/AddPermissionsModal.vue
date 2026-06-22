<template>
  <n-modal
    v-model:show="show"
    :mask-closable="false"
    preset="dialog"
    title="Добавить доступы"
    :style="{ width: '480px' }"
  >
    <div class="modal-content">
      <n-input
        v-model:value="searchText"
        placeholder="Поиск..."
        clearable
        style="margin-bottom: 16px"
      />

      <n-spin :show="loading">
        <n-list bordered hoverable size="small" class="select-list">
          <n-list-item
            v-for="item in filteredItems"
            :key="item.id"
            :class="{ selected: selectedIds.has(item.id) }"
            @click="toggleItem(item.id)"
          >
            <div class="item-row">
              <n-checkbox
                :checked="selectedIds.has(item.id)"
                @update:checked="toggleItem(item.id)"
                @click.stop
              />
              <div class="item-content">
                <div class="item-main">{{ item.name }}</div>
                <div v-if="item.description" class="item-sub">{{ item.description }}</div>
              </div>
            </div>
          </n-list-item>

          <n-list-item v-if="!loading && filteredItems.length === 0">
            <div class="empty-text">Нет доступных разрешений</div>
          </n-list-item>
        </n-list>
      </n-spin>

      <div class="modal-footer">
        <n-button @click="cancel">Закрыть</n-button>
        <n-button
          type="primary"
          :disabled="selectedIds.size === 0 || submitting"
          :loading="submitting"
          @click="confirm"
        >
          Добавить ({{ selectedIds.size }})
        </n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { NModal, NList, NListItem, NInput, NButton, NSpin, NCheckbox, useMessage } from 'naive-ui'
  import roleApi from '@/src/utils/api/role'

  const show = defineModel<boolean>('show', { required: true })

  const props = defineProps<{
    roleId: number
  }>()

  const emit = defineEmits<{
    added: []
  }>()

  const message = useMessage()

  interface Permission {
    id: number
    name: string
    description: string | null
  }

  const searchText = ref('')
  const loading = ref(false)
  const submitting = ref(false)
  const items = ref<Permission[]>([])
  const selectedIds = ref<Set<number>>(new Set())

  const filteredItems = computed(() => {
    const term = searchText.value.toLowerCase().trim()
    if (!term) return items.value
    return items.value.filter(
      item =>
        item.name.toLowerCase().includes(term) ||
        (item.description?.toLowerCase().includes(term) ?? false)
    )
  })

  function toggleItem(id: number) {
    const next = new Set(selectedIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedIds.value = next
  }

  async function loadPermissions() {
    loading.value = true
    try {
      items.value = await roleApi.getNewPermissionsForRole(props.roleId)
    } finally {
      loading.value = false
    }
  }

  async function confirm() {
    submitting.value = true
    try {
      await roleApi.addNewPermissionsToRole(props.roleId, [...selectedIds.value])
      message.success('Доступы успешно добавлены')
      emit('added')
      close()
    } finally {
      submitting.value = false
    }
  }

  function cancel() {
    close()
  }

  function close() {
    show.value = false
    setTimeout(() => {
      searchText.value = ''
      selectedIds.value = new Set()
    }, 300)
  }

  watch(show, visible => {
    if (visible) {
      searchText.value = ''
      selectedIds.value = new Set()
      loadPermissions()
    }
  })
</script>

<style scoped lang="scss">
  .modal-content {
    padding: 8px 0 16px;
  }

  .select-list {
    max-height: 360px;
    overflow-y: auto;
    margin-bottom: 20px;
    border-radius: 6px;
  }

  .item-row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .item-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    padding: 2px 0;
  }

  .item-main {
    font-weight: 500;
  }

  .item-sub {
    font-size: 0.86em;
    color: $color-text-subtle;
    margin-top: 2px;
  }

  .selected {
    background: var(--n-color-hover);
  }

  .empty-text {
    text-align: center;
    color: $color-text-placeholder;
    padding: 20px 0;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }
</style>
