// frontend/src/services/purchaseService.js
import apiClient from './apiClient'; // <-- Impor klien terpusat

export default {
  recordPurchase(purchaseData) {
    return apiClient.post('/purchases', purchaseData);
  }
};
