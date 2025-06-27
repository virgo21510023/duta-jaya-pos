import axios from 'axios';
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

export default {
  recordPurchase(purchaseData) {
    return apiClient.post('/purchases', purchaseData);
  }
};