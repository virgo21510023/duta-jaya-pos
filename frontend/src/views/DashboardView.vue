<!-- frontend/src/views/DashboardView.vue -->
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Dashboard</h1>
      <span class="text-muted">Data untuk Hari Ini: {{ todayDate }}</span>
    </div>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-2">Memuat data dashboard...</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error && dashboardData">
      <!-- Kartu Ringkasan -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card h-100 border-start border-success border-4">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <div class="text-xs fw-bold text-success text-uppercase mb-1">Omzet Hari Ini</div>
                  <div class="h5 mb-0 fw-bold text-gray-800">{{ formatRupiah(dashboardData.salesSummary.totalRevenue) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card h-100 border-start border-info border-4">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <div class="text-xs fw-bold text-info text-uppercase mb-1">Transaksi Hari Ini</div>
                  <div class="h5 mb-0 fw-bold text-gray-800">{{ dashboardData.salesSummary.totalTransactions }} Transaksi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Produk Terlaris -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              Produk Terlaris Hari Ini
            </div>
            <div class="card-body">
              <ul v-if="dashboardData.topProducts.length > 0" class="list-group list-group-flush">
                <li v-for="(product, index) in dashboardData.topProducts" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                  {{ product.name }}
                  <span class="badge bg-primary rounded-pill">{{ product.sold }} terjual</span>
                </li>
              </ul>
              <p v-else class="text-muted">Belum ada produk yang terjual hari ini.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import reportService from '../services/reportService';

const dashboardData = ref(null);
const loading = ref(true);
const error = ref(null);

const todayDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

async function fetchDashboardData() {
  try {
    loading.value = true;
    const response = await reportService.getDashboardStats();
    dashboardData.value = response.data;
  } catch (err) {
    error.value = 'Gagal memuat data dashboard.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.text-xs {
  font-size: .7rem;
}
</style>
