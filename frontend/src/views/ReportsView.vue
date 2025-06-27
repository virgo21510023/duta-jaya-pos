<!-- frontend/src/views/ReportsView.vue -->
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Laporan Penjualan</h1>
    </div>

    <!-- Filter Section -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Pilih Periode Laporan</h5>
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label for="startDate" class="form-label">Tanggal Mulai</label>
            <input type="date" class="form-control" id="startDate" v-model="filters.startDate">
          </div>
          <div class="col-md-4">
            <label for="endDate" class="form-label">Tanggal Akhir</label>
            <input type="date" class="form-control" id="endDate" v-model="filters.endDate">
          </div>
          <div class="col-md-4">
            <button class="btn btn-primary w-100" @click="generateReport" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Tampilkan Laporan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Memuat...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="reportData && profitLossData && !loading">
      <!-- Summary Cards -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-white bg-success">
            <div class="card-body">
              <h6 class="card-title">TOTAL OMZET</h6>
              <p class="card-text fs-4 fw-bold">{{ formatRupiah(reportData.summary.totalRevenue) }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-warning">
            <div class="card-body">
              <h6 class="card-title">TOTAL HPP (MODAL)</h6>
              <p class="card-text fs-4 fw-bold">{{ formatRupiah(profitLossData.totalCogs) }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <h6 class="card-title">LABA KOTOR</h6>
              <p class="card-text fs-4 fw-bold">{{ formatRupiah(reportData.summary.totalRevenue - profitLossData.totalCogs) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- V-- KARTU BARU UNTUK METODE PEMBAYARAN --V -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card bg-light">
            <div class="card-body">
              <h6 class="card-title text-muted">TOTAL TUNAI (CASH)</h6>
              <p class="card-text fs-4 fw-bold">{{ formatRupiah(reportData.summary.paymentMethodTotals.cash) }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-light">
            <div class="card-body">
              <h6 class="card-title text-muted">TOTAL QRIS</h6>
              <p class="card-text fs-4 fw-bold">{{ formatRupiah(reportData.summary.paymentMethodTotals.qris) }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-light">
            <div class="card-body">
              <h6 class="card-title text-muted">TOTAL TRANSFER</h6>
              <p class="card-text fs-4 fw-bold">{{ formatRupiah(reportData.summary.paymentMethodTotals.transfer) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Table -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Detail Transaksi Periode Ini</h5>
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kode Transaksi</th>
                  <th>Pelanggan</th>
                  <th>Metode Bayar</th>
                  <th class="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trx in reportData.transactions" :key="trx.id">
                  <td>{{ formatDate(trx.createdAt) }}</td>
                  <td>{{ trx.transaction_code }}</td>
                  <td>{{ trx.customer_name || 'Umum' }}</td>
                  <td>{{ trx.payment_method.toUpperCase() }}</td>
                  <td class="text-end">{{ formatRupiah(trx.total_amount) }}</td>
                </tr>
                 <tr v-if="reportData.transactions.length === 0">
                  <td colspan="5" class="text-center">Tidak ada transaksi pada periode ini.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // <-- Impor onMounted
import reportService from '../services/reportService';

const reportData = ref(null);
const profitLossData = ref(null);
const loading = ref(false);
const error = ref(null);

const getTodayDate = () => new Date().toISOString().split('T')[0];

const filters = ref({
  startDate: getTodayDate(),
  endDate: getTodayDate()
});

const generateReport = async () => {
  if (!filters.value.startDate || !filters.value.endDate) {
    alert('Harap pilih tanggal mulai dan tanggal akhir.');
    return;
  }
  loading.value = true;
  error.value = null;
  reportData.value = null;
  profitLossData.value = null;

  try {
    const [salesResponse, profitLossResponse] = await Promise.all([
      reportService.getSalesReport(filters.value),
      reportService.getProfitLossReport(filters.value)
    ]);
    reportData.value = salesResponse.data;
    profitLossData.value = profitLossResponse.data;
  } catch (err) {
    error.value = 'Gagal mengambil data laporan.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

// V-- JALANKAN OTOMATIS SAAT HALAMAN DIBUKA --V
onMounted(() => {
  generateReport();
});
</script>
