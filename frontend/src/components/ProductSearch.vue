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
              
              <!-- V-- PERBAIKAN TAMPILAN STOK --V -->
              <div :class="product.stock_quantity > 0 ? 'text-muted' : 'text-danger fw-bold'">
                Stok: {{ parseInt(product.stock_quantity) }} {{ product.unit }}
              </div>
            </td>
            <td class="text-end fw-bold">
              {{ formatRupiah(product.base_price) }}
            </td>
            <td class="text-center" style="width: 120px;">
              <button 
                class="btn w-100"
                :class="product.stock_quantity > 0 ? 'btn-success' : 'btn-secondary'"
                :disabled="product.stock_quantity <= 0"
                @click="addToCart(product)"
              >
                {{ product.stock_quantity > 0 ? 'Tambah' : 'Stok Habis' }}
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
import { ref, computed } from 'vue';
import { useCartStore } from '../stores/cart.store';

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: Boolean,
  error: String,
});

const searchQuery = ref('');
const cartStore = useCartStore();

const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return props.products;
  }
  return props.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (product.product_code && product.product_code.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

function addToCart(product) {
  cartStore.addProduct(product);
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}
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
