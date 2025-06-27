<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-md-7">
        <div class="card">
          <div class="card-body">
            <ProductSearch />
          </div>
        </div>
      </div>

      <div class="col-md-5">
         <div class="card">
          <div class="card-body">
            <ShoppingCart @process-payment="openPaymentModal" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <PaymentModal 
    v-if="isPaymentModalOpen"
    :show="isPaymentModalOpen" 
    :total-price="cartStore.totalPrice"
    @close="closePaymentModal"
    @submit="handleProcessTransaction"
  />
  <ReceiptTemplate 
    v-if="lastTransactionForPrint" 
    :transaction="lastTransactionForPrint" 
  />
</template>

<script setup>
import { ref, nextTick } from 'vue';
import ProductSearch from '../components/ProductSearch.vue';
import ShoppingCart from '../components/ShoppingCart.vue';
import PaymentModal from '../components/PaymentModal.vue';
import ReceiptTemplate from '../components/pos/ReceiptTemplate.vue';
import { useCartStore } from '../stores/cart.store';
import transactionService from '../services/transactionService';

const cartStore = useCartStore();
const isPaymentModalOpen = ref(false);
const lastTransactionForPrint = ref(null);

// -- Fungsi-fungsi untuk Pembayaran --
function openPaymentModal() {
  if (cartStore.items.length === 0) {
    alert('Keranjang belanja masih kosong!');
    return;
  }
  isPaymentModalOpen.value = true;
}

function closePaymentModal() {
  isPaymentModalOpen.value = false;
}

async function handleProcessTransaction(paymentData) {
  const itemsWithFinalPrice = cartStore.items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: cartStore.calculatePriceForItem(item),
    base_price: item.base_price
  }));

  const transactionPayload = {
    ...paymentData,
    items: itemsWithFinalPrice,
    total_amount: cartStore.totalPrice,
  };

  try {
    const response = await transactionService.createTransaction(transactionPayload);
    alert(`Transaksi berhasil disimpan! Kode: ${response.data.transaction.transaction_code}`);
    closePaymentModal();
    
    lastTransactionForPrint.value = {
      ...response.data.transaction,
      items: transactionPayload.items
    };

    await nextTick();
    window.print();

    cartStore.clearCart();
    lastTransactionForPrint.value = null;
  } catch (error) {
    console.error('Gagal menyimpan transaksi:', error);
    alert(`Transaksi Gagal: ${error.response?.data?.message || error.message}`);
  }
}
</script>

<style scoped>
.card {
  height: calc(100vh - 100px);
  overflow: hidden;
}
.card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}
</style>
