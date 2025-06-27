// frontend/src/services/transactionService.js
import apiClient from './apiClient'; // <-- Impor klien terpusat

export default {
  createTransaction(transactionData) {
    return apiClient.post('/transactions', transactionData);
  },

  getAllTransactions() {
    return apiClient.get('/transactions');
  },

  getTransactionById(id) {
    return apiClient.get(`/transactions/${id}`);
  },
  
  getTransactionByCode(code) {
    return apiClient.get(`/transactions/code/${code}`);
  }
};
