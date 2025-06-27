// frontend/src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

// Impor semua halaman/view Anda
import DashboardView from '../views/DashboardView.vue'; // <-- Impor halaman baru
import InventoryView from '../views/InventoryView.vue';
import PosView from '../views/PosView.vue';
import ReportsView from '../views/ReportsView.vue';
import PurchasingView from '../views/PurchasingView.vue';
import LoginView from '../views/LoginView.vue';
import TransactionHistoryView from '../views/TransactionHistoryView.vue';
import UserManagementView from '../views/UserManagementView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // V-- UBAH HALAMAN UTAMA MENJADI DASHBOARD --V
    { path: '/', name: 'dashboard', component: DashboardView },
    
    { path: '/login', name: 'login', component: LoginView },
    { path: '/pos', name: 'pos', component: PosView },
    { path: '/history', name: 'history', component: TransactionHistoryView },
    { path: '/inventory', name: 'inventory', component: InventoryView },
    { path: '/reports', name: 'reports', component: ReportsView },
    { path: '/purchasing', name: 'purchasing', component: PurchasingView },
    { path: '/users', name: 'users', component: UserManagementView },
    
    // Redirect semua path yang tidak cocok ke halaman utama
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
});

// Navigation Guard tidak berubah
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !authStore.isLoggedIn) {
    return '/login';
  }

  if (!authRequired && authStore.isLoggedIn) {
    // Arahkan ke halaman dashboard setelah login
    return '/';
  }
});

export default router;
