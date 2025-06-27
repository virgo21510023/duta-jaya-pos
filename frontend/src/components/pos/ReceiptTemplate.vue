<template>
  <div class="receipt-container">
    <div class="store-header text-center">
      <h2>DUTA JAYA</h2>
      <p>Jl. Kimia Raya No. 123, Jakarta</p>
      <p>Telp: 021-12345678</p>
    </div>
    <hr class="divider">

    <div class="transaction-details">
      <div><span>No. Transaksi:</span> <span>{{ transaction.transaction_code }}</span></div>
      <div><span>Tanggal:</span> <span>{{ formatDate(transaction.createdAt) }}</span></div>
      <div><span>Pelanggan:</span> <span>{{ transaction.customer_name || 'Umum' }}</span></div>
    </div>
    <hr class="divider">

    <div class="items-list">
      <table>
        <thead>
          <tr>
            <th>Barang</th>
            <th class="text-end">Qty</th>
            <th class="text-end">Harga</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in transaction.items" :key="item.id">
            <td>{{ item.name }}</td>
            <td class="text-end">{{ item.quantity }}</td>
            <td class="text-end">{{ formatRupiah(item.price) }}</td>
            <td class="text-end">{{ formatRupiah(item.price * item.quantity) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr class="divider">

    <div class="totals">
      <div><span>Total Belanja:</span> <span class="fw-bold">{{ formatRupiah(transaction.total_amount) }}</span></div>
      <div><span>Metode Bayar:</span> <span class="fw-bold">{{ transaction.payment_method.toUpperCase() }}</span></div>
    </div>
    <hr class="divider">

    <div class="footer text-center">
      <p>Terima kasih telah berbelanja!</p>
      <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
    default: () => ({ items: [] }) // Default value untuk mencegah error
  }
});

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID').format(number || 0);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}
</script>

<style>
/* CSS ini HANYA akan aktif saat mencetak */
@media print {
  /* Sembunyikan semua elemen di body secara default */
  body * {
    visibility: hidden;
  }

  /* Tampilkan hanya container nota dan semua isinya */
  .receipt-container, .receipt-container * {
    visibility: visible;
  }

  /* Posisikan container nota di pojok kiri atas halaman cetak */
  .receipt-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-family: 'Courier New', Courier, monospace; /* Font khas Dot Matrix */
    font-size: 10pt;
  }

  .text-center { text-align: center; }
  .text-end { text-align: right; }
  .fw-bold { font-weight: bold; }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 2px 0;
  }

  hr.divider {
    border-top: 1px dashed black;
    margin: 5px 0;
  }

  .transaction-details div, .totals div {
    display: flex;
    justify-content: space-between;
  }
}

/* Aturan untuk ukuran halaman cetak */
@page {
  size: A5; /* Ukuran standar untuk 1/2 A4 */
  margin: 10mm;
}
</style>