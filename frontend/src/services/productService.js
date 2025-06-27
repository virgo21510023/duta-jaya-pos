// frontend/src/services/productService.js

import apiClient from './apiClient';

export default {
  /**
   * Mengambil data produk dari backend.
   * @param {object} params - Opsional. Objek berisi { page, limit } untuk paginasi.
   * @returns {Promise}
   */
  getProducts(params = {}) {
    // Jika params kosong, backend akan menggunakan nilai defaultnya.
    return apiClient.get('/products', { params });
  },

  createProduct(productData) {
    return apiClient.post('/products', productData);
  },

  updateProduct(id, productData) {
    return apiClient.put(`/products/${id}`, productData);
  },

  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },

  getUnits() {
    return apiClient.get('/products/units');
  },
  
  getGrades() {
    return apiClient.get('/products/grades');
  },

  managePriceTiers(productId, tiers) {
    return apiClient.put(`/products/${productId}/tiers`, { tiers });
  }
};
