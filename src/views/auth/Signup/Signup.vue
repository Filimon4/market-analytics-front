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
        <n-button
          type="primary"
          size="large"
          :loading="loading"
          attr-type="submit"
          block
        >
          {{ loading ? "Регистрация..." : "Зарегестрироваться" }}
        </n-button>
      </n-form-item>
    </n-form>

    <div class="hint">
      Уже есть аккаунт? <router-link to="/auth/signin">Авторизуйтерь</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Пожалуйста, введите email', trigger: ['blur', 'input'] },
    { type: 'email', message: 'Некорректный email', trigger: ['blur', 'input'] }
  ],
  password: [
    { required: true, message: 'Пожалуйста, введите пароль', trigger: ['blur', 'input'] },
    { min: 8, message: "Пароль не должен быть кароче 8 символов", trigger: ['input'] }
  ]
}

const handleLogin = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    loading.value = true

    try {
      await new Promise(r => setTimeout(r, 1000))

      message.success('Успешный вход!')
      router.push('/dashboard')
    } catch (err) {
      message.error('Ошибка входа. Проверьте данные.')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>

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
  gap: 20px;
}

.container-header {
  text-align: center;
  font-size: 1.8rem;
  margin: 0;
}

.hint {
  text-align: center;
  color: #666;
}

a {
  color: #18a058;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>