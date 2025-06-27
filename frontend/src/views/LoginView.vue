<!-- frontend/src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <h3 class="card-title fw-bold">DUTA JAYA POS</h3>
          <p class="text-muted">Silakan login untuk melanjutkan</p>
        </div>
        
        <div class="time-display text-center mb-4">
          <p class="mb-0 fs-5">{{ currentTime.time }}</p>
          <p class="text-muted small mb-0">{{ currentTime.date }}</p>
        </div>
        
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
          <div class="d-grid mt-4">
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const credentials = ref({
  username: '',
  password: ''
});
const loading = ref(false);
const errorMessage = ref('');

const currentTime = ref({ time: '', date: '' });
let timeInterval = null;

function updateTime() {
  const now = new Date();
  currentTime.value.time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  currentTime.value.date = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(credentials.value);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat login.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@keyframes gradient-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-animation 15s ease infinite;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  background: rgba(255, 255, 255, 0.98); /* Sedikit lebih solid */
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease-out;
}

/* V-- PERBAIKAN KONTRAS TEKS --V */
.login-card .card-title {
  color: #2c3e50; /* Warna biru gelap agar lebih tegas */
}

.login-card .text-muted {
  color: #6c757d !important; /* Warna abu-abu standar yang lebih gelap */
}

.login-card .form-label {
  color: #495057; /* Warna abu-abu gelap untuk label */
  font-weight: 500;
}

.time-display {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.time-display .fs-5 {
  color: #212529; /* Warna hitam untuk waktu */
  font-weight: 500;
}
</style>
