// frontend/src/services/productService.js

import apiClient from './apiClient'; // <-- Impor klien terpusat

export default {
  getProducts() {
    return apiClient.get('/products');
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
