<!-- frontend/src/components/PaymentModal.vue -->
<template>
  <div>
    <div class="modal fade" :class="{ 'd-block show': show }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Proses Pembayaran</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <!-- V-- INPUT NAMA PELANGGAN DIPINDAHKAN KE SINI --V -->
            <div class="mb-3">
              <label for="customerName" class="form-label">Nama Pelanggan (Opsional)</label>
              <input type="text" class="form-control" id="customerName" v-model="paymentDetails.customerName">
            </div>
            
            <div class="mb-3">
              <label class="form-label">Metode Pembayaran</label>
              <div class="d-flex gap-2">
                <button class="btn w-100" :class="paymentDetails.paymentMethod === 'cash' ? 'btn-success' : 'btn-outline-success'" @click="paymentDetails.paymentMethod = 'cash'">Tunai</button>
                <button class="btn w-100" :class="paymentDetails.paymentMethod === 'qris' ? 'btn-success' : 'btn-outline-success'" @click="paymentDetails.paymentMethod = 'qris'">QRIS</button>
                <button class="btn w-100" :class="paymentDetails.paymentMethod === 'transfer' ? 'btn-success' : 'btn-outline-success'" @click="paymentDetails.paymentMethod = 'transfer'">Transfer</button>
              </div>
            </div>
            <hr>
            <div class="d-flex justify-content-between fs-5 mb-3">
              <span>Total Belanja:</span>
              <span class="fw-bold">{{ formatRupiah(totalPrice) }}</span>
            </div>
            <div v-if="paymentDetails.paymentMethod === 'cash'">
              <div class="mb-3">
                <label for="amountPaid" class="form-label">Uang Dibayar</label>
                <input type="text" class="form-control form-control-lg" id="amountPaid" v-model="formattedAmountPaid">
              </div>
              <div class="d-flex justify-content-between fs-5">
                <span>Kembalian:</span>
                <span class="fw-bold text-danger">{{ formatRupiah(change) }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Batal</button>
            <button type="button" class="btn btn-primary" @click="submitPayment" :disabled="isSubmitDisabled">Simpan Transaksi</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>
  </div>
</template>
    
<script setup>
import { ref, computed } from 'vue';
    
const props = defineProps({ show: Boolean, totalPrice: Number });
const emit = defineEmits(['close', 'submit']);
    
// V-- STATE LOKAL DIPERBARUI --V
const paymentDetails = ref({ 
  customerName: '', 
  paymentMethod: 'cash', 
  amountPaid: 0 
});
    
const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const parseRupiah = (str) => Number(String(str).replace(/[^0-9]/g, ''));
    
const formattedAmountPaid = computed({
  get: () => formatRupiah(paymentDetails.value.amountPaid),
  set: (val) => paymentDetails.value.amountPaid = parseRupiah(val)
});
    
const change = computed(() => paymentDetails.value.amountPaid - props.totalPrice);
    
const isSubmitDisabled = computed(() => {
  if (paymentDetails.value.paymentMethod === 'cash' && change.value < 0) {
    return true;
  }
  return false;
});

function submitPayment() {
  // Kirim semua data termasuk nama pelanggan
  emit('submit', {
    payment_method: paymentDetails.value.paymentMethod,
    customer_name: paymentDetails.value.customerName
  });
}
</script>
