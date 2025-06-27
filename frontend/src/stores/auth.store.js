// frontend/src/stores/auth.store.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '../router'; // Impor router untuk navigasi
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', () => {
  // === STATE ===
  // Mengambil data dari localStorage saat pertama kali dimuat.
  // Ini membuat pengguna tetap login bahkan setelah me-refresh halaman.
  const user = ref(JSON.parse(localStorage.getItem('user')));
  const token = ref(localStorage.getItem('token'));

  // === GETTERS ===
  // Getter untuk memeriksa apakah pengguna sudah login
  const isLoggedIn = computed(() => !!token.value);
  
  // Getter untuk memeriksa apakah pengguna adalah admin
  const isAdmin = computed(() => user.value?.role === 'admin');

  // === ACTIONS ===
  /**
   * Menangani proses login.
   * @param {object} credentials - Berisi username dan password.
   */
  async function login(credentials) {
    try {
      // Panggil API login dari service
      const response = await authService.login(credentials);
      
      // Simpan data yang diterima dari backend
      token.value = response.data.token;
      user.value = response.data.user;

      // Simpan juga ke localStorage agar data tidak hilang saat refresh
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      // Arahkan pengguna ke halaman utama setelah login berhasil
      router.push('/');

    } catch (error) {
      console.error("Login gagal:", error);
      // Lempar error agar bisa ditangani di komponen Login
      throw error; 
    }
  }

  /**
   * Menangani proses logout.
   */
  function logout() {
    // Hapus data dari state
    token.value = null;
    user.value = null;

    // Hapus data dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Arahkan pengguna ke halaman login
    router.push('/login');
  }

  // Expose state, getters, dan actions
  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  };
});
