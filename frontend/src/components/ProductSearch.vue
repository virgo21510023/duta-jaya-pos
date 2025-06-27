<template>
  <div class="product-search-container">
    <div class="mb-3">
      <input 
        type="text" 
        class="form-control form-control-lg" 
        placeholder="Cari produk berdasarkan nama atau kode..." 
        v-model="searchQuery"
      >
    </div>

    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Memuat produk...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="product-list" v-if="!loading && !error">
      <table class="table table-hover">
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>
              <div class="fw-bold">{{ product.name }}</div>
              <small class="text-muted">{{ product.product_code || 'Tanpa Kode' }}</small>
            </td>
            <td class="text-end fw-bold">
              {{ formatRupiah(product.base_price) }}
            </td>
            <td class="text-center" style="width: 120px;">
              <button class="btn btn-success w-100" @click="addToCart(product)">
                Tambah
              </button>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="3" class="text-center text-muted">Produk tidak ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import productService from '../services/productService';
import { useCartStore } from '../stores/cart.store';

// -- State Lokal Komponen --
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');

// -- Menggunakan Store --
const cartStore = useCartStore();

// -- Computed Property untuk Pencarian --
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value;
  }
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (product.product_code && product.product_code.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// -- Fungsi-Fungsi --
async function fetchProducts() {
  try {
    loading.value = true;
    const response = await productService.getProducts();
    // API sekarang mengirim produk beserta tingkatan harganya (price_tiers)
    products.value = response.data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    error.value = 'Gagal memuat daftar produk.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// V-- PERBAIKAN UTAMA ADA DI SINI --V
function addToCart(product) {
  // V-- TAMBAHKAN BARIS INI --V
  console.log('LANGKAH 1: Data dikirim dari ProductSearch:', product);
  
  // Baris ini sudah ada
  cartStore.addProduct(product);
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

// -- Lifecycle Hook --
onMounted(() => {
  fetchProducts();
});

</script>

<style scoped>
.product-search-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.product-list {
  flex-grow: 1;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
}
tr {
  vertical-align: middle;
}
</style>
