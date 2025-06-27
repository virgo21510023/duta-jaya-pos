<!-- frontend/src/components/ShoppingCart.vue -->
<template>
  <div class="shopping-cart-container d-flex flex-column h-100">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Keranjang Belanja</h5>
      <button 
        v-if="cartStore.items.length > 0" 
        class="btn btn-outline-danger btn-sm" 
        @click="clearCart"
        title="Kosongkan Keranjang"
      >
        <i class="fas fa-trash-alt me-1"></i> Kosongkan
      </button>
    </div>
    
    <div class="cart-items flex-grow-1">
      <div v-if="!cartStore.items || cartStore.items.length === 0" class="text-center text-muted empty-cart">
        Keranjang masih kosong
      </div>
      <ul v-else class="list-group list-group-flush">
        <li v-for="item in cartStore.items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="item-details">
            <div class="fw-bold">{{ item.name }}</div>
            <!-- V-- TAMPILKAN SATUAN DI SINI --V -->
            <small>{{ formatRupiah(cartStore.calculatePriceForItem(item)) }} x {{ item.quantity }} {{ item.unit }}</small>
          </div>
          <div class="item-controls d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary" @click="cartStore.decrementQuantity(item.id)">-</button>
            <input 
              type="number" 
              class="form-control form-control-sm text-center mx-1" 
              style="width: 60px;"
              :value="item.quantity"
              @change="cartStore.updateQuantity(item.id, $event.target.value)"
            >
            <button class="btn btn-sm btn-outline-secondary" @click="cartStore.incrementQuantity(item.id)">+</button>
            <button class="btn btn-sm btn-outline-danger ms-2" @click="cartStore.removeProduct(item.id)">&times;</button>
          </div>
        </li>
      </ul>
    </div>

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
        <button class="btn btn-warning" disabled title="Fitur sedang dalam perbaikan">Tunda Transaksi</button>
        <button class="btn btn-success btn-lg" @click="$emit('process-payment')" :disabled="cartStore.items.length === 0">PROSES PEMBAYARAN</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart.store';
const cartStore = useCartStore();
const emit = defineEmits(['process-payment']);

function clearCart() {
  if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja?')) {
    cartStore.clearCart();
  }
}

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
