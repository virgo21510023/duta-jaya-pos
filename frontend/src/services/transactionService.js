// frontend/src/services/transactionService.js
import apiClient from './apiClient';

export default {
  createTransaction(transactionData) {
    return apiClient.post('/transactions', transactionData);
  },

  // V-- FUNGSI INI TELAH DIPERBARUI --V
  getAllTransactions(params = {}) {
    return apiClient.get('/transactions', { params });
  },

  getTransactionById(id) {
    return apiClient.get(`/transactions/${id}`);
  },
  
  getTransactionByCode(code) {
    return apiClient.get(`/transactions/code/${code}`);
  }
};
