<!-- frontend/src/views/TransactionHistoryView.vue -->
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Riwayat Transaksi</h1>
    </div>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border" role="status">
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
                <td>{{ trx.payment_method.toUpperCase() }}</td>
                <td class="text-end">{{ formatRupiah(trx.total_amount) }}</td>
                <td class="text-center">
                  <button class="btn btn-secondary btn-sm" @click="handleReprint(trx.id)">
                    Cetak Ulang
                  </button>
                </td>
              </tr>
              <tr v-if="transactions.length === 0">
                <td colspan="6" class="text-center">Belum ada riwayat transaksi.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Komponen nota untuk dicetak (tersembunyi) -->
  <ReceiptTemplate v-if="transactionToPrint" :transaction="transactionToPrint" />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import transactionService from '../services/transactionService';
import ReceiptTemplate from '../components/pos/ReceiptTemplate.vue'; // Gunakan lagi komponen nota

// State
const transactions = ref([]);
const loading = ref(true);
const error = ref(null);
const transactionToPrint = ref(null);

// Fungsi untuk mengambil data
async function fetchTransactions() {
  try {
    loading.value = true;
    const response = await transactionService.getAllTransactions();
    transactions.value = response.data;
  } catch (err) {
    error.value = 'Gagal memuat riwayat transaksi.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Fungsi untuk menangani cetak ulang
async function handleReprint(transactionId) {
  try {
    // 1. Ambil detail lengkap transaksi dari API
    const response = await transactionService.getTransactionById(transactionId);
    transactionToPrint.value = response.data;

    // 2. Tunggu DOM diperbarui dengan data baru
    await nextTick();

    // 3. Panggil dialog cetak
    window.print();

    // 4. Bersihkan state setelah mencetak
    transactionToPrint.value = null;

  } catch (err) {
    alert('Gagal mengambil data untuk dicetak ulang.');
    console.error(err);
  }
}

// Helper format
const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

// Lifecycle hook
onMounted(() => {
  fetchTransactions();
});
</script>
