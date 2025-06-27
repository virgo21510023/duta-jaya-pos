<!-- frontend/src/components/pos/HeldTransactionsModal.vue -->
<template>
  <div>
    <div class="modal fade" :class="{ 'd-block show': show }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Daftar Transaksi Tertunda</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <div v-if="transactions.length === 0" class="text-center text-muted">
              Tidak ada transaksi yang ditunda.
            </div>
            <ul v-else class="list-group">
              <li v-for="trx in transactions" :key="trx.id" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div class="fw-bold">{{ trx.customer_name || 'Tanpa Nama' }}</div>
                  <small class="text-muted">{{ formatDate(trx.createdAt) }} - {{ formatRupiah(trx.total_amount) }}</small>
                </div>
                <div>
                  <button class="btn btn-primary btn-sm me-2" @click="$emit('resume', trx.id)">Lanjutkan</button>
                  <button class="btn btn-outline-danger btn-sm" @click="$emit('delete', trx.id)">Hapus</button>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
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
  transactions: {
    type: Array,
    required: true,
  }
});

defineEmits(['close', 'resume', 'delete']);

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const formatDate = (dateString) => new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
</script>
