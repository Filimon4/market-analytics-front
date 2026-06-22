<template>
  <div class="container">
    <h2 class="container-header">Регистрация</h2>

    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      @submit.prevent="handleLogin"
      :show-label="false"
      class="container-form"
    >
      <n-form-item path="email">
        <n-input
          v-model:value="form.email"
          placeholder="Почта"
          type="email"
          :style="{ textAlign: 'left' }"
        />
      </n-form-item>

      <n-form-item path="name">
        <n-input
          v-model:value="form.name"
          placeholder="Имя"
          type="text"
          :style="{ textAlign: 'left' }"
        />
      </n-form-item>

      <n-form-item path="password">
        <n-input
          v-model:value="form.password"
          type="password"
          placeholder="Пароль"
          show-password-on="click"
          :style="{ textAlign: 'left' }"
        />
      </n-form-item>

      <n-form-item>
        <n-button type="primary" size="large" :loading="loading" attr-type="submit" block>
          {{ loading ? 'Регистрация...' : 'Зарегестрироваться' }}
        </n-button>
      </n-form-item>
    </n-form>

    <div class="hint">
      Уже есть аккаунт? <router-link to="/auth/signin">Авторизуйтерь</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMessage } from 'naive-ui'
  import { useUserStore } from '@/src/store/user'
  import authApi from '@/src/utils/api/auth'
  import userApi from '@/src/utils/api/user'

  const router = useRouter()
  const message = useMessage()

  const formRef = ref(null)
  const loading = ref(false)

  const userStore = useUserStore()

  const form = reactive({
    email: '',
    password: '',
    name: '',
  })

  const rules = {
    email: [
      { required: true, message: 'Пожалуйста, введите email', trigger: ['blur', 'input'] },
      { type: 'email', message: 'Некорректный email', trigger: ['blur', 'input'] },
    ],
    password: [
      { required: true, message: 'Пожалуйста, введите пароль', trigger: ['blur', 'input'] },
      { min: 8, message: 'Пароль не должен быть кароче 8 символов', trigger: ['input'] },
    ],
    name: [
      { required: true, message: 'Пожалуйста, введите имя', trigger: ['blur', 'input'] },
      { min: 5, message: 'Имя должно состоять не мении чем из 5 символов', trigger: ['input'] },
    ],
  }

  const handleLogin = () => {
    formRef.value?.validate(async errors => {
      if (errors) return

      loading.value = true

      try {
        const token = await authApi.singup(form.email, form.password, form.name)
        userStore.accessToken = token
        userStore.user = await userApi.getCurrent()

        message.success('Успешный вход!')
        router.push('/')
      } catch (err) {
        message.error('Ошибка входа. Проверьте данные.')
      } finally {
        loading.value = false
      }
    })
  }
</script>

<style scoped lang="scss">
  .container {
    width: 300px;
  }

  .login-form-input {
    margin: 0;
  }

  .container-form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }

  .container-header {
    text-align: center;
    font-size: 1.8rem;
    margin: 0;
  }

  .hint {
    text-align: center;
    color: $color-text-muted;
  }

  a {
    color: $color-success;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
