// frontend/src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia' // <-- 1. Impor createPinia

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const app = createApp(App)
const pinia = createPinia() // <-- 2. Buat instance Pinia

app.use(pinia) // <-- 3. Beritahu aplikasi Vue untuk menggunakan Pinia
app.use(router)

app.mount('#app')