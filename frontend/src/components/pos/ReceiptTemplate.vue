<!-- frontend/src/components/pos/ReceiptTemplate.vue -->
<template>
  <div class="receipt-container">
    <!-- Header Toko -->
    <div class="store-header text-center">
      <h2>DUTA JAYA</h2>
      <!-- Alamat dan Telepon dibuat satu baris untuk menghemat ruang -->
      <p>Jl. Kimia Raya No. 123, Jakarta | Telp: 021-12345678</p>
    </div>
    <hr class="divider">

    <!-- Detail Transaksi dengan layout 2 kolom -->
    <div class="transaction-details-grid">
      <div><strong>No. Transaksi:</strong> {{ transaction.transaction_code }}</div>
      <div><strong>Tanggal:</strong> {{ formatDate(transaction.createdAt) }}</div>
      <div><strong>Pelanggan:</strong> {{ transaction.customer_name || 'Umum' }}</div>
      <div><strong>Metode Bayar:</strong> {{ transaction.payment_method.toUpperCase() }}</div>
    </div>
    <hr class="divider">

    <!-- Daftar Item -->
    <div class="items-list">
      <table>
        <thead>
          <tr>
            <th>Barang</th>
            <th class="text-center">Qty</th>
            <th class="text-end">Harga</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in transaction.items" :key="item.id">
            <td>{{ item.name }}</td>
            <td class="text-center">{{ item.quantity }} {{ item.unit }}</td>
            <td class="text-end">{{ formatRupiah(item.price) }}</td>
            <td class="text-end">{{ formatRupiah(item.price * item.quantity) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr class="divider">

    <!-- Total Keseluruhan dan Footer -->
    <div class="totals-grid">
        <div class="footer-notes">
            <p>Terima kasih telah berbelanja!</p>
            <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
        </div>
        <div class="totals">
            <div>
                <span>Total Belanja:</span> 
                <span class="fw-bold">{{ formatRupiah(transaction.total_amount) }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
    default: () => ({ items: [] })
  }
});

function formatRupiah(number) {
  // Menggunakan format standar tanpa simbol mata uang untuk dot matrix
  return new Intl.NumberFormat('id-ID').format(number || 0);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}
</script>

<style>
/* V-- CSS TELAH DIPERBARUI UNTUK LANDSCAPE --V */
@media print {
  body * {
    visibility: hidden;
  }
  .receipt-container, .receipt-container * {
    visibility: visible;
  }
  .receipt-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt; /* Ukuran font sedikit lebih kecil */
    color: #000;
  }
  .text-center { text-align: center; }
  .text-end { text-align: right; }
  .fw-bold { font-weight: bold; }
  
  .store-header h2 {
    margin: 0;
    font-size: 14pt;
  }
  .store-header p {
    margin: 0;
    font-size: 8pt;
  }

  .transaction-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 15px; /* Memberi jarak antar kolom */
    font-size: 9pt;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 5px 0;
  }
  th, td {
    padding: 2px;
    vertical-align: top;
  }
  th {
    border-bottom: 1px dashed black;
  }

  hr.divider {
    border: none;
    border-top: 1px dashed black;
    margin: 5px 0;
  }
  
  .totals-grid {
      display: grid;
      grid-template-columns: 2fr 1.5fr; /* Kolom kiri lebih besar */
      align-items: end;
  }
  
  .footer-notes {
      font-size: 8pt;
  }
  
  .totals div {
    display: flex;
    justify-content: space-between;
    font-size: 10pt;
    margin-top: 2px;
  }
}

@page {
  /* Mengatur halaman menjadi landscape setengah A4 (A5) */
  size: A5 landscape;
  margin: 8mm;
}
</style>
