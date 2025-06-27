<!-- frontend/src/views/ReturnView.vue -->
<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <!-- V-- KOLOM KIRI: DAFTAR TRANSAKSI --V -->
      <div class="col-md-7">
        <div class="card">
          <div class="card-header">
            <h5>1. Pilih Transaksi yang Akan Diretur</h5>
          </div>
          <div class="card-body d-flex flex-column">
            <!-- Filter Tanggal -->
            <div class="row g-2 mb-3">
              <div class="col-sm-5">
                <input type="date" class="form-control form-control-sm" v-model="filters.startDate">
              </div>
              <div class="col-sm-5">
                <input type="date" class="form-control form-control-sm" v-model="filters.endDate">
              </div>
              <div class="col-sm-2 d-grid">
                <button class="btn btn-secondary btn-sm" @click="resetFilters" title="Reset Filter">Reset</button>
              </div>
            </div>

            <!-- Tabel Daftar Transaksi -->
            <div class="table-responsive flex-grow-1">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Kode</th>
                    <th>Pelanggan</th>
                    <th class="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="4" class="text-center">Memuat transaksi...</td>
                  </tr>
                  <tr v-else-if="transactions.length === 0">
                    <td colspan="4" class="text-center">Tidak ada transaksi pada periode ini.</td>
                  </tr>
                  <tr v-for="trx in transactions" :key="trx.id" @click="selectTransaction(trx.id)" :class="{'table-info': selectedTransaction && selectedTransaction.id === trx.id}" style="cursor: pointer;">
                    <td>{{ formatDate(trx.createdAt, true) }}</td>
                    <td>{{ trx.transaction_code }}</td>
                    <td>{{ trx.customer_name || 'Umum' }}</td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-info">Pilih</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- V-- KOLOM KANAN: DETAIL RETUR --V -->
      <div class="col-md-5">
        <div class="card">
          <div class="card-header">
            <h5>2. Tentukan Jumlah Item yang Diretur</h5>
          </div>
          <div class="card-body">
            <div v-if="!selectedTransaction" class="text-center text-muted h-100 d-flex align-items-center justify-content-center">
              <p>Pilih sebuah transaksi dari daftar di sebelah kiri untuk memulai.</p>
            </div>
            <div v-else>
              <p><strong>Kode Transaksi:</strong> {{ selectedTransaction.transaction_code }}</p>
              <hr>
              <div class="table-responsive" style="max-height: 40vh; overflow-y: auto;">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Nama Barang</th>
                      <th class="text-center">Qty Beli</th>
                      <th class="text-center" style="width: 120px;">Qty Retur</th>
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
              <hr>
              <div class="mb-3">
                <label for="returnReason" class="form-label">Alasan Retur (Opsional)</label>
                <input type="text" class="form-control" id="returnReason" v-model="returnReason">
              </div>
              <div class="d-grid">
                <button class="btn btn-success btn-lg" @click="processReturn" :disabled="!isReturnValid || isProcessing">
                  <span v-if="isProcessing" class="spinner-border spinner-border-sm"></span>
                  <span v-else>Proses Retur Senilai {{ formatRupiah(totalReturnValue) }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

const totalReturnValue = computed(() => {
  if (!selectedTransaction.value) return 0;
  return returnItems.value.reduce((total, item) => {
    return total + (item.price * (item.return_quantity || 0));
  }, 0);
});

async function fetchTransactions() {
  loading.value = true;
  error.value = null;
  try {
    const response = await transactionService.getAllTransactions({
        page: 1,
        limit: 200, // Ambil hingga 200 transaksi terakhir yang cocok
        startDate: filters.value.startDate,
        endDate: filters.value.endDate
    });
    transactions.value = response.data.transactions; 
  } catch (err) {
    error.value = 'Gagal memuat riwayat transaksi.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = { startDate: '', endDate: '' };
  fetchTransactions();
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

watch(filters, fetchTransactions, { deep: true });

onMounted(() => {
  fetchTransactions();
});

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const formatDate = (dateString, simple = false) => {
  if(simple) return new Date(dateString).toLocaleDateString('id-ID');
  return new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}
</script>

<style scoped>
.card {
  height: calc(100vh - 100px);
}
.card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.table-responsive {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
