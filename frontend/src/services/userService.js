// frontend/src/services/userService.js

import apiClient from './apiClient'; // <-- Impor klien terpusat

export default {
  /**
   * Mengambil semua pengguna dari backend.
   * @returns {Promise}
   */
  getAllUsers() {
    // Tidak perlu lagi menambahkan header secara manual
    return apiClient.get('/users');
  },

  /**
   * Membuat pengguna baru.
   * @param {object} userData - Berisi username, password, dan role.
   * @returns {Promise}
   */
  createUser(userData) {
    return apiClient.post('/users', userData);
  },

  /**
   * Menghapus pengguna berdasarkan ID.
   * @param {number} id - ID pengguna yang akan dihapus.
   * @returns {Promise}
   */
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`);
  }
};
