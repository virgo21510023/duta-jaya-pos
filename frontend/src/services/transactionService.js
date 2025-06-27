// frontend/src/services/transactionService.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default {
  // Fungsi yang sudah ada
  createTransaction(transactionData) {
    return apiClient.post('/transactions', transactionData);
  },
  getAllTransactions() {
    return apiClient.get('/transactions');
  },
  getTransactionById(id) {
    return apiClient.get(`/transactions/${id}`);
  },

  // V-- FUNGSI BARU UNTUK TRANSAKSI TERTUNDA --V
  /**
   * Menyimpan keranjang saat ini sebagai transaksi tertunda.
   * @param {object} holdData - Data keranjang yang akan ditunda.
   * @returns {Promise}
   */
  holdTransaction(holdData) {
    return apiClient.post('/transactions/hold', holdData);
  },

  /**
   * Mengambil semua transaksi yang sedang ditunda.
   * @returns {Promise}
   */
  getHeldTransactions() {
    return apiClient.get('/transactions/hold');
  },

  /**
   * Menghapus transaksi yang ditunda (setelah dilanjutkan atau dibatalkan).
   * @param {number} id - ID transaksi yang akan dihapus.
   * @returns {Promise}
   */
  deleteHeldTransaction(id) {
    return apiClient.delete(`/transactions/hold/${id}`);
  }
};
