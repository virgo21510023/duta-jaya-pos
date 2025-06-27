<!-- frontend/src/App.vue -->
<template>
  <nav v-if="authStore.isLoggedIn" class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">DUTA JAYA POS</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- V-- TAMBAHKAN LINK DASHBOARD DI SINI --V -->
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" active-class="active">Dashboard</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/pos" class="nav-link" active-class="active">Kasir</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/history" class="nav-link" active-class="active">Riwayat Transaksi</RouterLink>
          </li>
          <template v-if="authStore.isAdmin">
            <li class="nav-item">
              <RouterLink to="/inventory" class="nav-link" active-class="active">Inventaris</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/purchasing" class="nav-link" active-class="active">Pembelian</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/reports" class="nav-link" active-class="active">Laporan</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/users" class="nav-link" active-class="active">Pengguna</RouterLink>
            </li>
          </template>
        </ul>
        <div class="d-flex align-items-center text-white">
          <span class="me-3">Halo, {{ authStore.user?.username }} ({{ authStore.user?.role }})</span>
          <button class="btn btn-outline-light" @click="authStore.logout()">Logout</button>
        </div>
      </div>
    </div>
  </nav>

  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth.store';
const authStore = useAuthStore();
</script>
