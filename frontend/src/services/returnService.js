// frontend/src/services/returnService.js

import apiClient from './apiClient'; // <-- Impor klien terpusat

export default {
  /**
   * Memproses pengembalian barang.
   * @param {object} returnData - Data lengkap retur.
   * @returns {Promise}
   */
  processReturn(returnData) {
    // Tidak perlu lagi menambahkan header secara manual, interceptor akan melakukannya.
    return apiClient.post('/returns', returnData);
  }
};
