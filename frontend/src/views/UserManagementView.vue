<!-- frontend/src/views/UserManagementView.vue -->
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Manajemen Pengguna</h1>
      <button class="btn btn-primary" @click="openAddModal">Tambah Pengguna Kasir</button>
    </div>

    <!-- Tabel Pengguna -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center"><div class="spinner-border"></div></div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div class="table-responsive" v-if="!loading && !error">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>Username</th>
                <th>Peran (Role)</th>
                <th>Terdaftar Sejak</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.username }}</td>
                <td><span class="badge" :class="user.role === 'admin' ? 'bg-success' : 'bg-secondary'">{{ user.role }}</span></td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td class="text-center">
                  <button class="btn btn-danger btn-sm" @click="confirmDelete(user)" :disabled="isSelf(user.id)">
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal untuk Tambah Pengguna -->
    <div class="modal fade" :class="{ 'd-block show': isModalOpen }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tambah Pengguna Baru</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleCreateUser">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" v-model="newUser.username" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="newUser.password" required>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Peran</label>
                <select class="form-select" id="role" v-model="newUser.role">
                  <option value="kasir">Kasir</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isModalOpen" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import userService from '../services/userService';
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);
const isSubmitting = ref(false);

const newUser = ref({
  username: '',
  password: '',
  role: 'kasir'
});

const isSelf = computed(() => (userId) => authStore.user?.id === userId);

async function fetchUsers() {
  try {
    loading.value = true;
    const response = await userService.getAllUsers();
    users.value = response.data;
  } catch (err) {
    error.value = 'Gagal memuat data pengguna. Pastikan Anda memiliki hak akses Admin.';
  } finally {
    loading.value = false;
  }
}

function openAddModal() {
  newUser.value = { username: '', password: '', role: 'kasir' };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function handleCreateUser() {
  isSubmitting.value = true;
  try {
    await userService.createUser(newUser.value);
    alert('Pengguna baru berhasil dibuat!');
    closeModal();
    await fetchUsers(); // Refresh daftar pengguna
  } catch (err) {
    alert(`Gagal membuat pengguna: ${err.response?.data?.message || err.message}`);
  } finally {
    isSubmitting.value = false;
  }
}

async function confirmDelete(user) {
  if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.username}"?`)) {
    try {
      await userService.deleteUser(user.id);
      alert('Pengguna berhasil dihapus.');
      await fetchUsers(); // Refresh daftar pengguna
    } catch (err) {
      alert(`Gagal menghapus pengguna: ${err.response?.data?.message || err.message}`);
    }
  }
}

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { dateStyle: 'long' });

onMounted(() => {
  fetchUsers();
});
</script>
