<template>
  <div class="container mt-4">
    <!-- Header dan Pencarian -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Daftar Stok Barang</h1>
      <button class="btn btn-primary" @click="openAddModal">Tambah Produk Baru</button>
    </div>
    <div class="mb-3">
      <input type="text" class="form-control" placeholder="Cari nama barang atau kode..." v-model="searchQuery">
    </div>

    <!-- Loading dan Error State -->
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Memuat...</span>
      </div>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Tabel Produk -->
    <div class="table-responsive" v-if="!loading && !error">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>Kode</th>
            <th>Nama Barang</th>
            <th>Grade</th>
            <th>Stok</th>
            <th>Satuan</th>
            <th>Harga Jual</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.product_code || '-' }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.grade || 'N/A' }}</td>
            <td>{{ product.stock_quantity }}</td>
            <td>{{ product.unit }}</td>
            <td>{{ formatRupiah(product.base_price) }}</td>
            <td class="text-center">
              <button class="btn btn-warning btn-sm me-2" @click="openEditModal(product)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="confirmDelete(product)">Hapus</button>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="7" class="text-center">Tidak ada data yang cocok.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Bootstrap untuk Form Tambah/Edit -->
    <div class="modal fade" :class="{ 'd-block show': isModalOpen }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleFormSubmit">
              <!-- Form utama untuk detail produk -->
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3"><label for="code" class="form-label">Kode Barang</label><input type="text" class="form-control" id="code" v-model="newProduct.product_code"></div>
                  <div class="mb-3"><label for="name" class="form-label">Nama Barang</label><input type="text" class="form-control" id="name" v-model="newProduct.name" required></div>
                  <div class="mb-3"><label for="grade" class="form-label">Grade</label><input type="text" class="form-control" id="grade" v-model="newProduct.grade" list="grade-list"><datalist id="grade-list"><option v-for="grade in gradeOptions" :key="grade" :value="grade"></option></datalist></div>
                  <div class="mb-3"><label for="unit" class="form-label">Satuan</label><input type="text" class="form-control" id="unit" v-model="newProduct.unit" required list="unit-list"><datalist id="unit-list"><option v-for="unit in unitOptions" :key="unit" :value="unit"></option></datalist></div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3"><label for="stock" class="form-label">Stok</label><input type="number" step="0.01" class="form-control" id="stock" v-model.number="newProduct.stock_quantity"></div>
                  <div class="mb-3"><label for="hpp" class="form-label">Harga Pokok (HPP)</label><input type="text" class="form-control" id="hpp" v-model="formattedHpp" required></div>
                  <div class="mb-3"><label for="price" class="form-label">Harga Jual Dasar</label><input type="text" class="form-control" id="price" v-model="formattedBasePrice" required></div>
                </div>
              </div>

              <!-- Bagian baru untuk Harga Bertingkat (hanya muncul saat mode Edit) -->
              <div v-if="editingProductId" class="mt-4">
                <hr>
                <h5>Pengelolaan Harga Bertingkat</h5>
                <p class="text-muted small">Harga akan otomatis mengikuti tingkatan ini di halaman kasir. Harga Jual di atas akan menjadi harga dasar.</p>
                <div v-for="(tier, index) in newProduct.price_tiers" :key="index" class="row align-items-center mb-2">
                  <div class="col-5">
                    <label class="form-label small">Kuantitas Minimal</label>
                    <input type="number" step="0.01" class="form-control" v-model.number="tier.min_qty" placeholder="Contoh: 6">
                  </div>
                  <div class="col-5">
                    <label class="form-label small">Harga per Unit</label>
                    <input type="number" step="0.01" class="form-control" v-model.number="tier.price" placeholder="Contoh: 32000">
                  </div>
                  <div class="col-2 pt-4">
                    <button type="button" class="btn btn-danger btn-sm" @click="removeTier(index)">Hapus</button>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm mt-2" @click="addTier">Tambah Tingkatan Harga</button>
              </div>

              <div class="modal-footer mt-4">
                <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
                <button type="submit" class="btn btn-success">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isModalOpen" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import productService from '../services/productService';

// State Reaktif
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);
const searchQuery = ref('');
const unitOptions = ref([]);
const gradeOptions = ref([]);
const newProduct = ref({});
const editingProductId = ref(null);

// Computed Properties
const modalTitle = computed(() => editingProductId.value ? 'Edit Produk' : 'Tambah Produk Baru');

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (product.product_code && product.product_code.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const parseRupiah = (str) => Number(String(str).replace(/[^0-9]/g, ''));

const formattedHpp = computed({
  get: () => newProduct.value.hpp ? formatRupiah(newProduct.value.hpp) : '',
  set: (value) => { newProduct.value.hpp = parseRupiah(value); }
});

const formattedBasePrice = computed({
  get: () => newProduct.value.base_price ? formatRupiah(newProduct.value.base_price) : '',
  set: (value) => { newProduct.value.base_price = parseRupiah(value); }
});

// Fungsi Logika Utama
async function fetchProducts() {
  try {
    loading.value = true;
    const response = await productService.getProducts();
    products.value = response.data;
    error.value = null;
  } catch (err) {
    error.value = 'Gagal memuat data dari server.';
  } finally {
    loading.value = false;
  }
}

async function fetchUniqueUnits() {
  try {
    const response = await productService.getUnits();
    unitOptions.value = response.data;
  } catch (err) { console.error('Gagal mengambil satuan:', err); }
}

async function fetchUniqueGrades() {
  try {
    const response = await productService.getGrades();
    gradeOptions.value = response.data;
  } catch (err) { console.error('Gagal mengambil grade:', err); }
}

function openAddModal() {
  editingProductId.value = null;
  newProduct.value = { product_code: '', name: '', grade: '', unit: '', stock_quantity: 0, hpp: 0, base_price: 0, price_tiers: [] };
  isModalOpen.value = true;
}

function openEditModal(product) {
  editingProductId.value = product.id;
  newProduct.value = { 
    ...product, 
    price_tiers: product.price_tiers ? JSON.parse(JSON.stringify(product.price_tiers)) : [] 
  };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingProductId.value = null;
}

async function handleFormSubmit() {
  try {
    if (editingProductId.value) {
      await productService.updateProduct(editingProductId.value, newProduct.value);
      await productService.managePriceTiers(editingProductId.value, newProduct.value.price_tiers);
      alert('Produk dan tingkatan harga berhasil diperbarui!');
    } else {
      await productService.createProduct(newProduct.value);
      alert('Produk baru berhasil ditambahkan!');
    }
    closeModal();
    await fetchProducts();
    await fetchUniqueUnits();
    await fetchUniqueGrades();
  } catch (err) {
    alert('Gagal menyimpan produk.');
    console.error(err);
  }
}

function confirmDelete(product) {
  // Logika untuk hapus akan kita buat di langkah selanjutnya
  alert(`Fitur Hapus untuk "${product.name}" akan dibuat selanjutnya!`);
}

// Fungsi untuk mengelola tingkatan harga
function addTier() {
  if (!newProduct.value.price_tiers) {
    newProduct.value.price_tiers = [];
  }
  newProduct.value.price_tiers.push({ min_qty: 0, price: 0 });
}

function removeTier(index) {
  newProduct.value.price_tiers.splice(index, 1);
}

// Lifecycle Hook
onMounted(async () => {
  await fetchProducts();
  await fetchUniqueUnits();
  await fetchUniqueGrades();
});
</script>

<style scoped>
.table td {
  vertical-align: middle;
}
.modal.d-block {
  display: block;
}
</style>
