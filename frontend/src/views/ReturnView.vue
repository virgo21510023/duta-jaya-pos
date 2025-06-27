<!-- frontend/src/views/ReturnView.vue -->
<template>
  <div class="container mt-4">
    <h1 class="mb-3">Retur Barang</h1>

    <!-- Filter dan Daftar Transaksi -->
    <div class="card">
      <div class="card-header">
        <h5>1. Pilih Transaksi yang Akan Diretur</h5>
      </div>
      <div class="card-body">
        <p class="text-muted">Tampilkan transaksi yang sudah selesai untuk dipilih.</p>
        <!-- Filter Tanggal -->
        <div class="row g-3 align-items-end mb-3">
          <div class="col-md-5">
            <label for="startDate" class="form-label">Tanggal Mulai</label>
            <input type="date" class="form-control" id="startDate" v-model="filters.startDate">
          </div>
          <div class="col-md-5">
            <label for="endDate" class="form-label">Tanggal Akhir</label>
            <input type="date" class="form-control" id="endDate" v-model="filters.endDate">
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary w-100" @click="fetchTransactions" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Filter</span>
            </button>
          </div>
        </div>
        
        <!-- Tabel Daftar Transaksi -->
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kode Transaksi</th>
                <th>Pelanggan</th>
                <th class="text-end">Total</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center">Memuat transaksi...</td>
              </tr>
              <tr v-else-if="transactions.length === 0">
                <td colspan="5" class="text-center">Tidak ada transaksi pada periode ini.</td>
              </tr>
              <tr v-for="trx in transactions" :key="trx.id" :class="{'table-info': selectedTransaction && selectedTransaction.id === trx.id}">
                <td>{{ formatDate(trx.createdAt) }}</td>
                <td>{{ trx.transaction_code }}</td>
                <td>{{ trx.customer_name || 'Umum' }}</td>
                <td class="text-end">{{ formatRupiah(trx.total_amount) }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-info" @click="selectTransaction(trx.id)">Pilih untuk Retur</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bagian Detail Item Retur -->
    <div v-if="selectedTransaction" :key="selectedTransaction.id" class="card mt-4">
      <div class="card-header">
        <h5>2. Tentukan Jumlah Item yang Diretur</h5>
        <p class="mb-0"><strong>Kode Transaksi:</strong> {{ selectedTransaction.transaction_code }}</p>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th class="text-center">Qty Dibeli</th>
                <th class="text-center" style="width: 150px;">Qty Retur</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in returnItems" :key="item.id">
                <td>{{ item.name }}</td>
                <td class="text-center">{{ item.original_quantity }}</td>
                <td class="text-center">
                  <input type="number" class="form-control form-control-sm text-center" v-model.number="item.return_quantity" min="0" :max="item.original_quantity">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mb-3">
          <label for="returnReason" class="form-label">Alasan Retur (Opsional)</label>
          <input type="text" class="form-control" id="returnReason" v-model="returnReason">
        </div>
        <div class="d-grid">
          <button class="btn btn-success btn-lg" @click="processReturn" :disabled="!isReturnValid || isProcessing">
            <span v-if="isProcessing" class="spinner-border spinner-border-sm"></span>
            <span v-else>Proses Retur</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import transactionService from '../services/transactionService';
import returnService from '../services/returnService';

const transactions = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedTransaction = ref(null);
const returnItems = ref([]);
const returnReason = ref('');
const isProcessing = ref(false);

const getTodayDate = () => new Date().toISOString().split('T')[0];
const filters = ref({ startDate: getTodayDate(), endDate: getTodayDate() });

const isReturnValid = computed(() => {
  return selectedTransaction.value && returnItems.value.some(item => item.return_quantity > 0 && item.return_quantity <= item.original_quantity);
});

// V-- FUNGSI INI TELAH DIPERBAIKI --V
async function fetchTransactions() {
  loading.value = true;
  error.value = null;
  try {
    // Panggil API dengan parameter filter yang sesuai
    const response = await transactionService.getAllTransactions({
        page: 1,
        limit: 100, // Ambil hingga 100 transaksi terakhir yang cocok
        startDate: filters.value.startDate,
        endDate: filters.value.endDate
    });
    // Akses array 'transactions' dari dalam objek respons
    transactions.value = response.data.transactions; 
  } catch (err) {
    error.value = 'Gagal memuat riwayat transaksi.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function selectTransaction(transactionId) {
  try {
    const response = await transactionService.getTransactionById(transactionId);
    selectedTransaction.value = response.data;
    returnItems.value = selectedTransaction.value.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      original_quantity: item.quantity,
      return_quantity: 0
    }));
  } catch (err) {
    alert('Gagal memuat detail transaksi.');
  }
}

async function processReturn() {
  if (!isReturnValid.value) return;
  isProcessing.value = true;

  const itemsToReturn = returnItems.value
    .filter(item => item.return_quantity > 0)
    .map(item => ({ id: item.id, quantity: item.return_quantity, price: item.price }));

  const returnPayload = {
    originalTransactionId: selectedTransaction.value.id,
    itemsToReturn: itemsToReturn,
    returnReason: returnReason.value
  };

  try {
    const response = await returnService.processReturn(returnPayload);
    alert(`Retur berhasil diproses! Kode Retur: ${response.data.data.transaction_code}`);
    selectedTransaction.value = null;
    returnItems.value = [];
    returnReason.value = '';
    await fetchTransactions();
  } catch (err) {
    alert(`Gagal memproses retur: ${err.response?.data?.message || err.message}`);
  } finally {
    isProcessing.value = false;
  }
}

onMounted(() => {
  fetchTransactions();
});

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
</script>
