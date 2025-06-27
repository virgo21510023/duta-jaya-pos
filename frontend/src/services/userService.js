// frontend/src/services/userService.js

import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Fungsi helper untuk mendapatkan header dengan token otentikasi
const getAuthHeaders = () => {
  const authStore = useAuthStore();
  const token = authStore.token;
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export default {
  /**
   * Mengambil semua pengguna dari backend.
   * @returns {Promise}
   */
  getAllUsers() {
    return apiClient.get('/users', { headers: getAuthHeaders() });
  },

  /**
   * Membuat pengguna baru.
   * @param {object} userData - Berisi username, password, dan role.
   * @returns {Promise}
   */
  createUser(userData) {
    return apiClient.post('/users', userData, { headers: getAuthHeaders() });
  },

  /**
   * Menghapus pengguna berdasarkan ID.
   * @param {number} id - ID pengguna yang akan dihapus.
   * @returns {Promise}
   */
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`, { headers: getAuthHeaders() });
  }
};
