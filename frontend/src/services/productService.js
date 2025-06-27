// frontend/src/services/productService.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Fungsi ini sudah ada
  getProducts() {
    return apiClient.get('/products');
  },
  
  // V-- TAMBAHKAN FUNGSI BARU INI --V
  createProduct(productData) {
    // Mengirim request POST ke endpoint '/products' dengan membawa data produk
    return apiClient.post('/products', productData);
  },

  // V-- TAMBAHKAN DUA FUNGSI BARU INI --V
  getUnits() {
    return apiClient.get('/products/units');
  },
  
  getGrades() {
    return apiClient.get('/products/grades');
  },

  updateProduct(id, productData) {
    // Mengirim request PUT ke endpoint '/products/:id'
    return apiClient.put(`/products/${id}`, productData);
  },  

  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },
  
  // V-- TAMBAHKAN FUNGSI BARU INI --V
  /**
   * Mengelola (menyimpan/mengupdate) tingkatan harga untuk sebuah produk.
   * @param {number} productId - ID dari produk yang akan diupdate.
   * @param {Array} tiers - Array berisi objek tingkatan harga.
   * @returns {Promise}
   */
  managePriceTiers(productId, tiers) {
    return apiClient.put(`/products/${productId}/tiers`, { tiers });
  }
};