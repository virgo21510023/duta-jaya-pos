<!-- frontend/src/components/ShoppingCart.vue -->
<template>
  <div class="shopping-cart-container d-flex flex-column h-100">
    <!-- Input Nama Pelanggan -->
    <div class="mb-3">
      <label for="customer-name" class="form-label">Nama Pelanggan</label>
      <input 
        type="text" 
        id="customer-name" 
        class="form-control" 
        :value="cartStore.customerName"
        @input="cartStore.setCustomerName($event.target.value)"
        placeholder="Masukkan nama pelanggan (opsional)"
      >
    </div>
    <hr>
    
    <!-- Daftar Item -->
    <div class="cart-items flex-grow-1">
      <div v-if="!cartStore.items || cartStore.items.length === 0" class="text-center text-muted empty-cart">
        Keranjang masih kosong
      </div>

      <ul v-else class="list-group list-group-flush">
        <li v-for="item in cartStore.items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="item-details">
            <div class="fw-bold">{{ item.name || 'Nama Produk Error' }}</div>
            <small>{{ formatRupiah(cartStore.calculatePriceForItem(item)) }} x {{ item.quantity }}</small>
          </div>
          
          <div class="item-controls d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary" @click="cartStore.decrementQuantity(item.id)">-</button>
            <span class="mx-2 quantity-text">{{ item.quantity }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click="cartStore.incrementQuantity(item.id)">+</button>
            <button class="btn btn-sm btn-outline-danger ms-3" @click="cartStore.removeProduct(item.id)">
              &times;
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Ringkasan & Total Belanja -->
    <div class="cart-summary mt-auto pt-3 border-top">
      <div class="summary-item d-flex justify-content-between">
        <span>Total Item</span>
        <span class="fw-bold">{{ cartStore.totalQuantity }}</span>
      </div>
      <div class="summary-item d-flex justify-content-between fs-4 mt-2">
        <span class="fw-bold">Total Belanja</span>
        <span class="fw-bold text-success">{{ formatRupiah(cartStore.totalPrice) }}</span>
      </div>
      <div class="d-grid gap-2 mt-3">
        <!-- Tombol Tunda Transaksi kita hapus dari emit dan dinonaktifkan permanen untuk sementara -->
        <button class="btn btn-warning" disabled title="Fitur sedang dalam perbaikan">Tunda Transaksi</button>
        <button class="btn btn-success btn-lg" @click="$emit('process-payment')" :disabled="cartStore.items.length === 0">PROSES PEMBAYARAN</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart.store';

const cartStore = useCartStore();
// Hanya emit process-payment
const emit = defineEmits(['process-payment']);

function formatRupiah(number) {
  if (typeof number !== 'number' || isNaN(number)) {
    number = 0;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}
</script>

<style scoped>
.shopping-cart-container { font-size: 0.95rem; }
.cart-items { overflow-y: auto; }
.empty-cart { padding-top: 50px; font-size: 1.1rem; }
.quantity-text { min-width: 20px; text-align: center; }
</style>
