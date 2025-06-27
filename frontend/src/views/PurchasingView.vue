<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3>Form Pencatatan Stok Masuk (Pembelian)</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="product" class="form-label">Pilih Produk</label>
                <select class="form-select" id="product" v-model="purchase.productId" required>
                  <option disabled value="">Pilih salah satu produk...</option>
                  <option v-for="product in productList" :key="product.id" :value="product.id">
                    {{ product.name }} (Stok saat ini: {{ product.stock_quantity }})
                  </option>
                </select>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="quantity" class="form-label">Kuantitas Masuk</label>
                  <input type="number" step="0.01" class="form-control" id="quantity" v-model.number="purchase.quantity" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="purchasePrice" class="form-label">Harga Beli / Unit (HPP)</label>
                  <input type="number" step="0.01" class="form-control" id="purchasePrice" v-model.number="purchase.purchasePrice" required>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="supplier" class="form-label">Nama Supplier (Opsional)</label>
                <input type="text" class="form-control" id="supplier" v-model="purchase.supplier">
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                  <span v-else>Simpan Pembelian & Tambah Stok</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import productService from '../services/productService';
import purchaseService from '../services/purchaseService';

const productList = ref([]);
const loading = ref(false);
const purchase = ref({
  productId: '',
  quantity: 0,
  purchasePrice: 0,
  supplier: ''
});

async function fetchProducts() {
  try {
    const response = await productService.getProducts();
    productList.value = response.data;
  } catch (error) {
    alert('Gagal memuat daftar produk.');
  }
}

function resetForm() {
  purchase.value = {
    productId: '',
    quantity: 0,
    purchasePrice: 0,
    supplier: ''
  };
}

async function handleSubmit() {
  loading.value = true;
  try {
    await purchaseService.recordPurchase(purchase.value);
    alert('Pembelian berhasil dicatat dan stok telah diperbarui!');
    resetForm();
    // Ambil ulang daftar produk untuk update info stok di dropdown
    await fetchProducts(); 
  } catch (error) {
    alert(`Gagal mencatat pembelian: ${error.response?.data?.message || error.message}`);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProducts();
});
</script>