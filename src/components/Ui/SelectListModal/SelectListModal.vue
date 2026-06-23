<template>
  <n-modal
    v-model:show="show"
    :mask-closable="maskClosable"
    preset="dialog"
    :title="title"
    :style="{ width }"
  >
    <div class="modal-content">
      <n-input
        v-if="searchable"
        v-model:value="searchText"
        :placeholder="searchPlaceholder"
        clearable
        class="search-input"
      />

      <slot
        name="filters"
        :filters="filtersModel"
        :set-filter="setFilter"
        :reset-filters="resetFilters"
        :reload="loadItems"
        :loading="loading"
      />

      <n-spin :show="loading">
        <n-list bordered hoverable size="small" class="select-list">
          <n-list-item
            v-for="item in visibleItems"
            :key="getItemId(item)"
            :class="{ selected: isSelected(item), disabled: isDisabled(item) }"
            @click="toggleItem(item)"
          >
            <slot
              name="item"
              :item="item"
              :selected="isSelected(item)"
              :disabled="isDisabled(item)"
              :toggle="() => toggleItem(item)"
            >
              <div class="item-row">
                <n-checkbox
                  v-if="selectionMode === 'multiple'"
                  :checked="isSelected(item)"
                  :disabled="isDisabled(item)"
                  @update:checked="toggleItem(item)"
                  @click.stop
                />
                <div class="item-content">
                  <div class="item-main">{{ getItemLabel(item) }}</div>
                  <div v-if="getItemDescription(item)" class="item-sub">
                    {{ getItemDescription(item) }}
                  </div>
                </div>
              </div>
            </slot>
          </n-list-item>

          <n-list-item v-if="!loading && visibleItems.length === 0">
            <slot name="empty" :search="searchText" :filters="filtersModel">
              <div class="empty-text">{{ emptyText }}</div>
            </slot>
          </n-list-item>
        </n-list>
      </n-spin>

      <slot
        name="footer"
        :selected-items="selectedItems"
        :selected-ids="selectedIdsList"
        :confirm="confirm"
        :cancel="cancel"
        :loading="loading"
      >
        <div class="modal-footer">
          <n-button @click="cancel">{{ cancelText }}</n-button>
          <n-button
            type="primary"
            :disabled="confirmDisabled"
            :loading="confirmLoading"
            @click="confirm"
          >
            {{ confirmButtonText }}
          </n-button>
        </div>
      </slot>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { NModal, NList, NListItem, NInput, NButton, NSpin, NCheckbox } from 'naive-ui'
  import type {
    ISelectListFetchContext,
    ISelectListItem,
    SelectListBuildFetchParams,
    SelectListFetchItems,
    SelectListFilterItems,
    SelectListItemId,
  } from './SelectListModal.types'

  const show = defineModel<boolean>('show', { required: true })

  const props = withDefaults(
    defineProps<{
      title: string
      fetchItems: SelectListFetchItems
      width?: string
      searchable?: boolean
      searchPlaceholder?: string
      searchDebounce?: number
      reloadOnSearch?: boolean
      emptyText?: string
      cancelText?: string
      confirmText?: string
      confirmLoading?: boolean
      maskClosable?: boolean
      selectionMode?: 'single' | 'multiple'
      initialSelectedIds?: SelectListItemId[]
      initialFilters?: Record<string, unknown>
      buildFetchParams?: SelectListBuildFetchParams
      filterItems?: SelectListFilterItems
      getId?: (item: ISelectListItem) => SelectListItemId
      getLabel?: (item: ISelectListItem) => string
      getDescription?: (item: ISelectListItem) => string | null | undefined
      isItemDisabled?: (item: ISelectListItem) => boolean
      closeOnConfirm?: boolean
      resetOnClose?: boolean
    }>(),
    {
      width: '480px',
      searchable: true,
      searchPlaceholder: 'Поиск...',
      searchDebounce: 350,
      reloadOnSearch: true,
      emptyText: 'Не найдено совпадений',
      cancelText: 'Закрыть',
      confirmText: 'Выбрать',
      confirmLoading: false,
      maskClosable: false,
      selectionMode: 'multiple',
      initialSelectedIds: () => [],
      initialFilters: () => ({}),
      buildFetchParams: ({ search, filters }: ISelectListFetchContext) => ({ search, ...filters }),
      filterItems: (items: ISelectListItem[]) => items,
      getId: (item: ISelectListItem) => item.id,
      getLabel: (item: ISelectListItem) => item.code ?? String(item.id),
      getDescription: (item: ISelectListItem) => item.description,
      isItemDisabled: (item: ISelectListItem) => Boolean(item.disabled),
      closeOnConfirm: true,
      resetOnClose: true,
    }
  )

  const emit = defineEmits<{
    confirm: [selectedItems: ISelectListItem[], selectedIds: SelectListItemId[]]
    cancel: []
    loaded: [items: ISelectListItem[]]
    error: [error: unknown]
    'update:filters': [filters: Record<string, unknown>]
  }>()

  const searchText = ref('')
  const loading = ref(false)
  const items = ref<ISelectListItem[]>([])
  const filtersModel = ref<Record<string, unknown>>({ ...props.initialFilters })
  const selectedIds = ref<Set<SelectListItemId>>(new Set(props.initialSelectedIds))
  const requestId = ref(0)
  let searchTimer: ReturnType<typeof setTimeout> | null = null

  const fetchContext = computed<ISelectListFetchContext>(() => ({
    search: searchText.value.trim(),
    filters: filtersModel.value,
  }))

  const visibleItems = computed(() => props.filterItems(items.value, fetchContext.value))

  const selectedIdsList = computed(() => [...selectedIds.value])

  const selectedItems = computed(() =>
    items.value.filter(item => selectedIds.value.has(getItemId(item)))
  )

  const confirmDisabled = computed(() => selectedIds.value.size === 0 || props.confirmLoading)

  const confirmButtonText = computed(() => {
    if (props.selectionMode === 'multiple' && selectedIds.value.size > 0) {
      return `${props.confirmText} (${selectedIds.value.size})`
    }

    return props.confirmText
  })

  function getItemId(item: ISelectListItem) {
    return props.getId(item)
  }

  function getItemLabel(item: ISelectListItem) {
    return props.getLabel(item)
  }

  function getItemDescription(item: ISelectListItem) {
    return props.getDescription(item)
  }

  function isDisabled(item: ISelectListItem) {
    return props.isItemDisabled(item)
  }

  function isSelected(item: ISelectListItem) {
    return selectedIds.value.has(getItemId(item))
  }

  function toggleItem(item: ISelectListItem) {
    if (isDisabled(item)) return

    const id = getItemId(item)

    if (props.selectionMode === 'single') {
      selectedIds.value = selectedIds.value.has(id) ? new Set() : new Set([id])
      return
    }

    const next = new Set(selectedIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedIds.value = next
  }

  function setFilter(key: string, value: unknown) {
    filtersModel.value = {
      ...filtersModel.value,
      [key]: value,
    }
    emit('update:filters', filtersModel.value)
    loadItems()
  }

  function resetFilters(nextFilters: Record<string, unknown> = props.initialFilters) {
    filtersModel.value = { ...nextFilters }
    emit('update:filters', filtersModel.value)
    loadItems()
  }

  async function loadItems() {
    const currentRequestId = requestId.value + 1
    requestId.value = currentRequestId
    loading.value = true

    try {
      const result = await props.fetchItems(
        props.buildFetchParams(fetchContext.value),
        fetchContext.value
      )
      if (currentRequestId !== requestId.value) return

      items.value = Array.isArray(result) ? result : []
      emit('loaded', items.value)
    } catch (error) {
      if (currentRequestId !== requestId.value) return

      items.value = []
      emit('error', error)
    } finally {
      if (currentRequestId === requestId.value) {
        loading.value = false
      }
    }
  }

  function confirm() {
    emit('confirm', selectedItems.value, selectedIdsList.value)
    if (props.closeOnConfirm) {
      close()
    }
  }

  function cancel() {
    emit('cancel')
    close()
  }

  function close() {
    show.value = false
  }

  function resetState() {
    searchText.value = ''
    filtersModel.value = { ...props.initialFilters }
    selectedIds.value = new Set(props.initialSelectedIds)
  }

  watch(show, visible => {
    if (visible) {
      resetState()
      loadItems()
      return
    }

    if (searchTimer) {
      clearTimeout(searchTimer)
      searchTimer = null
    }

    if (props.resetOnClose) {
      setTimeout(resetState, 300)
    }
  })

  watch(
    () => props.initialSelectedIds,
    value => {
      if (!show.value) {
        selectedIds.value = new Set(value)
      }
    }
  )

  watch(
    () => props.initialFilters,
    value => {
      if (!show.value) {
        filtersModel.value = { ...value }
      }
    }
  )

  watch(searchText, () => {
    if (!show.value) return
    if (!props.reloadOnSearch) return

    if (searchTimer) {
      clearTimeout(searchTimer)
    }

    searchTimer = setTimeout(loadItems, props.searchDebounce)
  })
</script>

<style scoped lang="scss">
  .modal-content {
    padding: 8px 0 16px;
  }

  .search-input {
    margin-bottom: 16px;
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

  .disabled {
    cursor: not-allowed;
    opacity: 0.55;
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
