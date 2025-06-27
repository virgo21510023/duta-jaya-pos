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
                  <li class="nav-item">
              <RouterLink to="/returns" class="nav-link" active-class="active">
                <i class="fas fa-undo me-1"></i> Retur Barang
              </RouterLink>
            </li>        
            </template>
          </ul>
          <div class="d-flex align-items-center">
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
const authStore = useAuthStore();
</script>

<style>
#app-wrapper {
  background-color: #f4f7f9;
  min-height: 100vh;
}

.navbar {
  border-bottom: 1px solid #e9ecef;
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

/* Sedikit spasi untuk ikon di dalam tombol */
.btn .fas {
  margin-right: 0.3rem;
}
</style>
