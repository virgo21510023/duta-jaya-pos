// frontend/src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// Impor store tema yang baru
import { useThemeStore } from './stores/theme.store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Panggil store SETELAH pinia di-`use` oleh app
const themeStore = useThemeStore();

app.mount('#app')
