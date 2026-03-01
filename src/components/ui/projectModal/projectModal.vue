<template>
  <n-modal
    v-model:show="show"
    :mask-closable="false"
    preset="dialog"
    :title="title"
    :style="{ width: '460px' }"
  >
    <div class="modal-content">
      <n-input
        v-model:value="searchText"
        :placeholder="placeholder"
        clearable
        style="margin-bottom: 16px;"
      />

      <n-spin :show="itemsLoading">
        <n-list bordered hoverable size="small" class="select-list">
          <n-list-item
            v-for="item in filteredItems"
            :key="item.id"
            :class="{ 'selected': selectedId === item.id }"
            @click="selectItem(item)"
          >
            <div class="item-content">
              <div class="item-main">{{ item.name }}</div>
              <div class="item-sub" v-if="item.description">
                {{ item.description }}
              </div>
            </div>
          </n-list-item>

          <n-list-item v-if="!itemsLoading && filteredItems.length === 0">
            <div style="text-align: center; color: #999; padding: 20px 0;">
              Не найдено совпадений
            </div>
          </n-list-item>
        </n-list>
      </n-spin>

      <div class="modal-footer">
        <n-button @click="cancel">Cancel</n-button>
        <n-button type="primary" :disabled="!selectedId" @click="confirm">
          Выбрать
        </n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue'
import {
  NModal,
  NList,
  NListItem,
  NInput,
  NButton,
  NSpin,
} from 'naive-ui'
import type { IProjectModalItem } from './projectModal.types'

const show = defineModel<boolean>("show")

const props = defineProps({
  items: {
    type: Array as PropType<IProjectModalItem[]>,
    default: () => [],
  },
  loadItems: {
    type: Function as PropType<() => Promise<IProjectModalItem[]>>,
    required: false,
  },
  initialSelectedId: [String, Number, null],
  placeholder: {
    type: String,
    default: 'Поиск...',
  },
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'confirm'
])

const searchText = ref('')
const selectedId = ref<string | null>(props.initialSelectedId as string | null)
const itemsLoading = ref(false)
const itemsList = ref<IProjectModalItem[]>(props.items)

const filteredItems = computed(() => {
  if (!searchText.value.trim()) return itemsList.value

  const term = searchText.value.toLowerCase().trim()
  return itemsList.value.filter((item) =>
    item.name?.toLowerCase().includes(term) ||
    item.description?.toLowerCase().includes(term)
  )
})

function selectItem(item: IProjectModalItem) {
  selectedId.value = item.id
}

function confirm() {
  const selectedItem = itemsList.value.find(i => i.id === selectedId.value)
  emit('confirm', selectedItem || null)
  close()
}

function cancel() {
  close()
}

function close() {
  show.value = false
  setTimeout(() => {
    searchText.value = ''
  }, 300)
}

async function loadItemsIfNeeded() {
  if (!props.loadItems) {
    itemsList.value = props.items
    return
  }

  itemsLoading.value = true
  try {
    const result = await props.loadItems()
    itemsList.value = Array.isArray(result) ? result : []
  } finally {
    itemsLoading.value = false
  }
}

watch(show, (newVal) => {
  if (newVal) {
    selectedId.value = props.initialSelectedId?.toString() || null
    searchText.value = ''
    loadItemsIfNeeded()
  }
})

watch(
  () => props.items,
  (val) => {
    if (!props.loadItems) {
      itemsList.value = val
    }
  }
)

watch(() => props.initialSelectedId, (val) => {
  selectedId.value = val?.toString() || null
})
</script>

<style scoped>
.modal-content {
  padding: 8px 0 16px;
}

.select-list {
  max-height: 360px;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 6px;
}

.item-content {
  display: flex;
  flex-direction: column;
  padding: 2px 0;
}

.item-main {
  font-weight: 500;
}

.item-sub {
  font-size: 0.86em;
  color: #888;
  margin-top: 2px;
}

.selected {
  background: var(--n-color-hover);
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>