<template>
  <div class="entity-wrapper">
    <CustomDataEntity
      :blocks="apiResult.blocks"
      :block-details="apiResult.blockDetails"
      :data="data"
    >
      <template #field="{ field, value }">
        <FieldEditable :field="field" :value="value" @update="handleFieldUpdate" />
      </template>
    </CustomDataEntity>
    <SaveAffix v-model:saving="saving" @cancel="handleCancel" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, type PropType } from 'vue'
  import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue'
  import FieldEditable from './FieldEditable.vue'
  import type {
    Data,
    IBlockDetail,
    IEntity,
    IField,
  } from '../CustomDataEntity/CustomDataEntity.type'
  import { useRouter } from 'vue-router'
  import SaveAffix from './SaveAffix.vue'

  const router = useRouter()

  const saving = ref(false)

  const data = ref<Data>({})

  const apiResult = ref<Pick<IEntity, 'blocks' | 'blockDetails'>>({
    blocks: [],
    blockDetails: [],
  })

  const props = defineProps({
    fetchDataReq: {
      required: true,
      type: Function as PropType<() => Promise<Pick<IEntity, 'blocks' | 'blockDetails'>>>,
    },
    saveDataReq: {
      required: true,
      type: Function as PropType<(data: Data) => Promise<{ id: string }>>,
    },
  })

  async function fetchData() {
    const response = await props.fetchDataReq()

    apiResult.value = {
      blocks: response.blocks.filter(b => {
        if (b?.createHide !== undefined && b?.createHide) {
          return false
        }
        return true
      }),
      blockDetails: response.blockDetails,
    }

    const blockTables = response.blocks.filter(block => block.blockType == 'table')
    response.blockDetails
      .filter(block => blockTables.map(bt => bt.code).includes(block.blockCode))
      .flatMap(block2 => (block2 as IBlockDetail).fields)
      .filter(field => !field.editable && field.createDefault !== undefined)
      .forEach(defaultField => {
        handleFieldUpdate({ field: defaultField, value: defaultField.createDefault })
      })
  }

  function handleFieldUpdate({ field, value }: { field: IField; value: Data[string] }) {
    let subObject: Data = {}
    const paths = field.path.split('.').reverse()

    const mergeObjects = (target: Data, source: Data) => {
      let out = target

      for (const key in target) {
        if (key in source) {
          const targetSub = target[key]
          const sourceSub = source[key]
          if (typeof targetSub !== 'object' && typeof sourceSub !== 'object') {
            out[key] = sourceSub
          } else {
            out[key] = mergeObjects(targetSub as Data, sourceSub as Data)
          }
        } else {
          out = Object.assign(out, source)
        }
      }

      return out
    }

    for (let i = 0; i <= paths.length - 1; i++) {
      if (i == paths.length - 1) {
        subObject[paths[i] as string] = value
        data.value = mergeObjects(subObject, data.value)
      } else if (i == 0) {
        subObject[paths[i] as string] = value
      } else {
        const copy = subObject
        subObject = {}
        subObject[paths[i] as string] = copy
      }
    }
  }

  async function handleSave() {
    if (saving.value) return
    saving.value = true
    const response = await props.saveDataReq(data.value).catch(() => {
      return null
    })

    if (!response) {
      saving.value = false
      return
    }

    router.push(response.id)
    saving.value = false
  }

  function handleCancel() {
    data.value = {}
    router.back()
  }

  onMounted(() => {
    fetchData()
  })
</script>

<style scoped>
  .entity-wrapper {
    height: 100%;
    width: 100%;
    position: relative;
  }
</style>
