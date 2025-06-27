// frontend/src/services/reportService.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default {
  /**
   * Mengambil laporan penjualan berdasarkan rentang tanggal.
   */
  getSalesReport({ startDate, endDate }) {
    return apiClient.get('/reports/sales', {
      params: { startDate, endDate }
    });
  },

  /**
   * Mengambil laporan laba-rugi berdasarkan rentang tanggal.
   */
  getProfitLossReport({ startDate, endDate }) {
    return apiClient.get('/reports/profit-loss', {
      params: { startDate, endDate }
    });
  },

  /**
   * Mengambil statistik untuk halaman dashboard.
   */
  getDashboardStats() {
    return apiClient.get('/reports/dashboard');
  }
};
