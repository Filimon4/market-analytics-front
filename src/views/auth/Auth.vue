<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1 class="logo">MyApp</h1>
      <router-view />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.auth-box {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.logo {
  margin: 0 0 2rem;
  font-size: 1.9rem;
  color: #333;
}
</style>