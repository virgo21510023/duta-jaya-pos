<!-- frontend/src/App.vue -->
<template>
  <div id="app-wrapper">
    <nav v-if="authStore.isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <RouterLink to="/" class="navbar-brand fw-bold text-primary">
          <i class="fas fa-store me-2"></i>DUTA JAYA POS
        </RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link" active-class="active">
                <i class="fas fa-tachometer-alt me-1"></i> Dashboard
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/pos" class="nav-link" active-class="active">
                <i class="fas fa-cash-register me-1"></i> Kasir
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/history" class="nav-link" active-class="active">
                <i class="fas fa-history me-1"></i> Riwayat Transaksi
              </RouterLink>
            </li>
             <li class="nav-item">
              <RouterLink to="/returns" class="nav-link" active-class="active">
                <i class="fas fa-undo me-1"></i> Retur Barang
              </RouterLink>
            </li>
            <template v-if="authStore.isAdmin">
              <li class="nav-item">
                <RouterLink to="/inventory" class="nav-link" active-class="active">
                  <i class="fas fa-boxes-stacked me-1"></i> Inventaris
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/purchasing" class="nav-link" active-class="active">
                  <i class="fas fa-dolly me-1"></i> Pembelian
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/reports" class="nav-link" active-class="active">
                  <i class="fas fa-chart-line me-1"></i> Laporan
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/users" class="nav-link" active-class="active">
                  <i class="fas fa-users-cog me-1"></i> Pengguna
                </RouterLink>
              </li>
            </template>
          </ul>
          <div class="d-flex align-items-center">
            <button class="btn btn-outline-secondary me-3" @click="themeStore.toggleTheme" :title="`Tema saat ini: ${themeStore.theme}`">
              <i class="fas" :class="themeIcon"></i>
            </button>
            <span class="navbar-text me-3">
              <i class="fas fa-user-circle me-1"></i> Halo, <span class="fw-bold">{{ authStore.user?.username }}</span>
            </span>
            <button class="btn btn-outline-danger btn-sm" @click="authStore.logout()">
              <i class="fas fa-sign-out-alt me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth.store';
import { useThemeStore } from './stores/theme.store';
import { computed, watch, onMounted } from 'vue'; // <-- Impor watch & onMounted

const authStore = useAuthStore();
const themeStore = useThemeStore();

const themeIcon = computed(() => {
  if (themeStore.theme === 'light') return 'fa-sun';
  if (themeStore.theme === 'dark') return 'fa-moon';
  return 'fa-desktop';
});

// V-- LOGIKA PENERAPAN TEMA DIPINDAHKAN KE SINI --V
function applyTheme(themeValue) {
  if (themeValue === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-bs-theme', systemPrefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-bs-theme', themeValue);
  }
}

// Pantau perubahan pada state tema di store
watch(() => themeStore.theme, (newTheme) => {
  applyTheme(newTheme);
});

// Set up listener dan tema awal saat aplikasi dimuat
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleSystemThemeChange = () => {
    if (themeStore.theme === 'system') {
      applyTheme('system');
    }
  };
  
  mediaQuery.addEventListener('change', handleSystemThemeChange);

  // Terapkan tema awal saat aplikasi pertama kali dimuat
  applyTheme(themeStore.theme);
});
</script>

<style>
/* Style tidak berubah */
#app-wrapper {
  background-color: #f4f7f9;
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

[data-bs-theme="dark"] #app-wrapper {
  background-color: #121212;
}

[data-bs-theme="dark"] .card {
  background-color: #1e1e1e;
  border-color: rgba(255, 255, 255, 0.12);
}

.navbar {
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

[data-bs-theme="dark"] .navbar {
    background-color: #1e1e1e !important;
    border-color: rgba(255, 255, 255, 0.12);
}

.nav-link {
  font-weight: 500;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.nav-link.active {
  color: #0d6efd !important;
}

.btn .fas {
  margin-right: 0.3rem;
}
</style>
