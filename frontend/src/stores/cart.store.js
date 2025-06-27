// frontend/src/stores/cart.store.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // === STATE ===
  const items = ref([]);
  const customerName = ref('');

  // === HELPERS ===
  function calculatePriceForItem(item) {
    if (!item || typeof item.id === 'undefined') return 0;

    const basePrice = Number(item.base_price) || 0;
    const tiers = Array.isArray(item.price_tiers) ? item.price_tiers : [];
    const quantity = Number(item.quantity) || 0;

    if (tiers.length === 0) {
      return basePrice;
    }
    
    const sortedTiers = [...tiers].sort((a, b) => Number(b.min_qty) - Number(a.min_qty));

    for (const tier of sortedTiers) {
      if (quantity >= Number(tier.min_qty)) {
        return Number(tier.price) || 0;
      }
    }
    
    return basePrice;
  }

  // === GETTERS ===
  const totalQuantity = computed(() => {
    return items.value.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      const currentPrice = calculatePriceForItem(item);
      const quantity = Number(item.quantity) || 0;
      return total + (currentPrice * quantity);
    }, 0);
  });

  // === ACTIONS ===
  function addProduct(product) {
    if (!product || typeof product.id === 'undefined') {
      console.error('Mencoba menambahkan produk yang tidak valid:', product);
      return;
    }

    const existingItem = items.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({ 
        id: product.id,
        name: product.name || 'Produk Tidak Dikenal',
        quantity: 1,
        base_price: Number(product.base_price) || 0,
        price_tiers: product.price_tiers || [],
      });
    }
  }

  function incrementQuantity(productId) {
    const item = items.value.find(item => item.id === productId);
    if (item) item.quantity++;
  }

  function decrementQuantity(productId) {
    const item = items.value.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
    } else if (item) {
      removeProduct(productId);
    }
  }

  function removeProduct(productId) {
    items.value = items.value.filter(item => item.id !== productId);
  }

  function clearCart() {
    items.value = [];
    customerName.value = '';
  }
  
  function setCustomerName(name) {
    customerName.value = name;
  }

  // Hapus semua fungsi yang berhubungan dengan 'Tunda Transaksi'
  // function setCartItems(newItems) { ... }

  return {
    items, customerName, totalQuantity, totalPrice,
    addProduct, removeProduct, clearCart,
    incrementQuantity, decrementQuantity,
    calculatePriceForItem, setCustomerName,
    // Jangan expose setCartItems untuk saat ini
  };
});
