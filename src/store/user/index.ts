import { defineStore } from 'pinia'
import { computed, type Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { IUser } from '@/src/utils/api/models/user'

interface IUserStore {
  isAuth: Ref<boolean>
  user: Ref<IUser | null>
  tenantId: Ref<bigint | number | null>
  accessToken: Ref<string | null>
}

export const useUserStore = defineStore('useUserStore', (): IUserStore => {
  const isAuth: IUserStore['isAuth'] = computed(() => false)
  const user = useStorage<IUser | null>('user', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    },
  }) satisfies Ref<IUser | null>

  const tenantId = useStorage<number | bigint>('tenantId', null, localStorage, {
    mergeDefaults: true,
  }) satisfies Ref<number | bigint | null>

  const accessToken = useStorage<string>('accessToken', null, localStorage, {
    mergeDefaults: true,
  }) satisfies Ref<string | null>

  return {
    isAuth,
    user,
    tenantId,
    accessToken,
  }
})
