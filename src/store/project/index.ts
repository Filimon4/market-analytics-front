import { defineStore } from "pinia"
import { ref, type Ref } from "vue"

interface IProject {
  isSelected: Ref<boolean>
  getId: () => number
  setId: (id: number) => void 
}

const useProject = defineStore('useProject', (): IProject => {
  const isSelected = ref<boolean>(false)
  const id = ref<number>(NaN)

  const getId = () => {
    return id.value
  }

  const setId = (newId: number) => {
    id.value = newId
  }

  return {
    isSelected,
    getId,
    setId,
  }
})

export default useProject