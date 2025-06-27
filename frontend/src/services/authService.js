// frontend/src/services/authService.js

import axios from 'axios';

// Kita bisa membuat instance axios baru atau menggunakan yang sudah ada
// Untuk konsistensi, kita buat yang baru untuk auth
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default {
  /**
   * Mengirim request POST ke endpoint login.
   * @param {object} credentials - Berisi username dan password.
   * @returns {Promise}
   */
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  }
};
