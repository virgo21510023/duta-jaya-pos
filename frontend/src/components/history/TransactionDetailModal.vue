<!-- frontend/src/components/history/TransactionDetailModal.vue -->
<template>
  <div>
    <div class="modal fade" :class="{ 'd-block show': show }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detail Transaksi</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body" v-if="transaction">
            <div class="row mb-3">
              <div class="col-md-6">
                <strong>Kode Transaksi:</strong> {{ transaction.transaction_code }}
              </div>
              <div class="col-md-6">
                <strong>Tanggal:</strong> {{ formatDate(transaction.createdAt) }}
              </div>
              <div class="col-md-6">
                <strong>Pelanggan:</strong> {{ transaction.customer_name || 'Umum' }}
              </div>
              <div class="col-md-6">
                <strong>Metode Bayar:</strong> <span class="badge bg-secondary">{{ transaction.payment_method.toUpperCase() }}</span>
              </div>
            </div>
            
            <hr>
            <h6>Daftar Barang:</h6>
            <div class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th class="text-center">Qty</th>
                    <th class="text-end">Harga Satuan</th>
                    <th class="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in transaction.items" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-end">{{ formatRupiah(item.price) }}</td>
                    <td class="text-end">{{ formatRupiah(item.price * item.quantity) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between align-items-center">
             <h5 class="mb-0">Total: <span class="text-success fw-bold">{{ formatRupiah(transaction.total_amount) }}</span></h5>
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Tutup</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  transaction: Object,
});
defineEmits(['close']);

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
</script>
