<!-- frontend/src/views/TransactionHistoryView.vue -->
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Riwayat Transaksi</h1>
    </div>

    <!-- Kontrol Filter dan Pencarian -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-5">
            <label for="searchQuery" class="form-label">Cari Kode/Nama Pelanggan</label>
            <input type="text" class="form-control" id="searchQuery" v-model="filters.search" placeholder="Masukkan pencarian...">
          </div>
          <div class="col-md-3">
            <label for="startDate" class="form-label">Tanggal Mulai</label>
            <input type="date" class="form-control" id="startDate" v-model="filters.startDate">
          </div>
          <div class="col-md-3">
            <label for="endDate" class="form-label">Tanggal Akhir</label>
            <input type="date" class="form-control" id="endDate" v-model="filters.endDate">
          </div>
          <div class="col-md-1 d-flex align-items-end">
            <button class="btn btn-secondary w-100" @click="resetFilters" title="Reset Filter">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Memuat...</span>
        </div>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card" v-if="!loading && !error">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>Tanggal</th>
                <th>Kode Transaksi</th>
                <th>Pelanggan</th>
                <th>Metode Bayar</th>
                <th class="text-end">Total</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trx in transactions" :key="trx.id">
                <td>{{ formatDate(trx.createdAt) }}</td>
                <td>{{ trx.transaction_code }}</td>
                <td>{{ trx.customer_name || 'Umum' }}</td>
                <td><span class="badge bg-secondary">{{ trx.payment_method.toUpperCase() }}</span></td>
                <td class="text-end">{{ formatRupiah(trx.total_amount) }}</td>
                <td class="text-center">
                  <button class="btn btn-primary btn-sm me-2" @click="showDetails(trx.id)">Detail</button>
                  <button class="btn btn-secondary btn-sm" @click="handleReprint(trx.id)">Cetak Ulang</button>
                </td>
              </tr>
              <tr v-if="transactions.length === 0">
                <td colspan="6" class="text-center">Tidak ada transaksi yang cocok dengan filter Anda.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Kontrol Paginasi -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="col-auto">
            <select class="form-select form-select-sm" v-model="pagination.itemsPerPage">
              <option value="10">10 per halaman</option>
              <option value="25">25 per halaman</option>
              <option value="50">50 per halaman</option>
            </select>
          </div>
          <nav v-if="pagination.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="goToPage(pagination.currentPage - 1)">Prev</a>
              </li>
              <li class="page-item disabled"><span class="page-link">Hal {{ pagination.currentPage }} dari {{ pagination.totalPages }}</span></li>
              <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.totalPages }">
                <a class="page-link" href="#" @click.prevent="goToPage(pagination.currentPage + 1)">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <ReceiptTemplate v-if="transactionToPrint" :transaction="transactionToPrint" />
  <!-- V-- PERBAIKAN UTAMA: GUNAKAN v-if UNTUK MENCEGAH RENDER DENGAN DATA NULL --V -->
  <TransactionDetailModal 
    v-if="selectedTransactionDetail"
    :show="isDetailModalOpen" 
    :transaction="selectedTransactionDetail"
    @close="closeDetailModal"
  />
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import transactionService from '../services/transactionService';
import ReceiptTemplate from '../components/pos/ReceiptTemplate.vue';
import TransactionDetailModal from '../components/history/TransactionDetailModal.vue';

// State
const transactions = ref([]);
const loading = ref(true);
const error = ref(null);
const transactionToPrint = ref(null);
const isDetailModalOpen = ref(false);
const selectedTransactionDetail = ref(null);

const filters = ref({ search: '', startDate: '', endDate: '' });
const pagination = ref({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 });

// Fungsi untuk mengambil data
async function fetchTransactions() {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.currentPage,
      limit: pagination.value.itemsPerPage,
      search: filters.value.search,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
    };
    const response = await transactionService.getAllTransactions(params);
    transactions.value = response.data.transactions;
    pagination.value.totalPages = response.data.totalPages;
    pagination.value.totalItems = response.data.totalItems;
    error.value = null;
  } catch (err) {
    error.value = 'Gagal memuat riwayat transaksi.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = { search: '', startDate: '', endDate: '' };
  pagination.value.currentPage = 1;
}

function goToPage(page) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.currentPage = page;
  }
}

watch(
  [() => pagination.value.currentPage, () => pagination.value.itemsPerPage, filters],
  fetchTransactions,
  { deep: true, immediate: true }
);

// Fungsi untuk menampilkan modal detail
async function showDetails(transactionId) {
  try {
    const response = await transactionService.getTransactionById(transactionId);
    selectedTransactionDetail.value = response.data;
    isDetailModalOpen.value = true;
  } catch (err) {
    alert('Gagal memuat detail transaksi.');
  }
}

// V-- FUNGSI BARU UNTUK MENUTUP MODAL DETAIL --V
function closeDetailModal() {
    isDetailModalOpen.value = false;
    // Kita set kembali ke null setelah modal ditutup
    selectedTransactionDetail.value = null; 
}

// Fungsi untuk cetak ulang
async function handleReprint(transactionId) {
  try {
    const response = await transactionService.getTransactionById(transactionId);
    transactionToPrint.value = response.data;
    await nextTick();
    window.print();
    transactionToPrint.value = null;
  } catch (err) {
    alert('Gagal mengambil data untuk dicetak ulang.');
  }
}

// Helper format
const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

</script>
