<template>
  <div>
    <h2>Sign In</h2>

    <form @submit.prevent="handleLogin">
      <div class="field">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div class="field">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="hint">
      Don't have an account? <router-link to="/auth/register">Sign up</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)

const router = useRouter()

const handleLogin = async () => {
  loading.value = true

  await new Promise(r => setTimeout(r, 800))
  // Example: await authStore.login(email.value, password.value)

  alert('Signed in! (fake success)')

  router.push('/dashboard')
  loading.value = false
}
</script>

<style scoped>
h2 {
  margin: 0 0 1.8rem;
  font-size: 1.6rem;
}

.field {
  margin-bottom: 1.3rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.9rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin: 1.2rem 0 1rem;
}

button:disabled {
  background: #88aaff;
  cursor: not-allowed;
}

.hint {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

a {
  color: #0066cc;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>