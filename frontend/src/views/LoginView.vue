<!-- frontend/src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <div class="card login-card">
      <div class="card-body">
        <h3 class="card-title text-center mb-4">Login DUTA JAYA POS</h3>
        
        <!-- Tampilkan pesan error jika ada -->
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input 
              type="text" 
              class="form-control" 
              id="username" 
              v-model="credentials.username" 
              required
            >
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              id="password" 
              v-model="credentials.password" 
              required
            >
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const credentials = ref({
  username: '',
  password: ''
});
const loading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';
  try {
    // Panggil action login dari store
    await authStore.login(credentials.value);
    // Navigasi akan ditangani di dalam store
  } catch (error) {
    // Tangkap error yang dilempar oleh store dan tampilkan pesannya
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat login.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}
.login-card {
  width: 100%;
  max-width: 400px;
  border: none;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
