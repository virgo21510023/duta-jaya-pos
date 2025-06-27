<!-- frontend/src/views/PosView.vue -->
<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <!-- Kolom Kiri untuk Pencarian Produk -->
      <div class="col-md-7">
        <div class="card">
          <div class="card-body">
            <ProductSearch 
              :products="products"
              :loading="loading"
              :error="error"
            />
          </div>
        </div>
      </div>

      <!-- Kolom Kanan untuk Keranjang Belanja -->
      <div class="col-md-5">
         <div class="card">
          <div class="card-body">
            <ShoppingCart @process-payment="openPaymentModal" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Komponen Modal Pembayaran dan Nota -->
  <PaymentModal 
    v-if="isPaymentModalOpen"
    :show="isPaymentModalOpen" 
    :total-price="cartStore.totalPrice"
    @close="closePaymentModal"
    @submit="handleProcessTransaction"
  />
  <ReceiptTemplate 
    v-if="lastTransactionForPrint" 
    :transaction="lastTransactionForPrint" 
  />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import ProductSearch from '../components/ProductSearch.vue';
import ShoppingCart from '../components/ShoppingCart.vue';
import PaymentModal from '../components/PaymentModal.vue';
import ReceiptTemplate from '../components/pos/ReceiptTemplate.vue';
import { useCartStore } from '../stores/cart.store';
import transactionService from '../services/transactionService';
import productService from '../services/productService';

const cartStore = useCartStore();
const isPaymentModalOpen = ref(false);
const lastTransactionForPrint = ref(null);

// State untuk data produk
const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Fungsi untuk mengambil semua data produk
async function fetchProducts() {
  try {
    loading.value = true;
    error.value = null;
    const response = await productService.getProducts({ page: 1, limit: 9999 }); 
    products.value = response.data.products;
  } catch (err) {
    error.value = 'Gagal memuat daftar produk.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Fungsi-fungsi untuk Pembayaran
function openPaymentModal() {
  if (cartStore.items.length === 0) {
    alert('Keranjang belanja masih kosong!');
    return;
  }
  isPaymentModalOpen.value = true;
}

function closePaymentModal() {
  isPaymentModalOpen.value = false;
}

async function handleProcessTransaction(paymentData) {
  // V-- PERBAIKAN UTAMA: MENAMBAHKAN 'unit' KE DALAM PAYLOAD --V
  const itemsWithFinalPrice = cartStore.items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: cartStore.calculatePriceForItem(item),
    base_price: item.base_price,
    unit: item.unit // <-- 'unit' sekarang disertakan
  }));

  const transactionPayload = {
    ...paymentData,
    items: itemsWithFinalPrice,
    total_amount: cartStore.totalPrice,
  };

  try {
    const response = await transactionService.createTransaction(transactionPayload);
    alert(`Transaksi berhasil disimpan! Kode: ${response.data.transaction.transaction_code}`);
    closePaymentModal();
    
    lastTransactionForPrint.value = {
      ...response.data.transaction,
      items: transactionPayload.items
    };

    await nextTick();
    window.print();

    cartStore.clearCart();
    lastTransactionForPrint.value = null;
    
    // Muat ulang daftar produk untuk update stok
    await fetchProducts();

  } catch (error) {
    console.error('Gagal menyimpan transaksi:', error);
    alert(`Transaksi Gagal: ${error.response?.data?.message || error.message}`);
  }
}

// Lifecycle Hook
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.card {
  height: calc(100vh - 100px);
  overflow: hidden;
}
.card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}
</style>
