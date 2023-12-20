import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { fetchInstance } from './core/FetchTokenInstance'
fetchInstance()

const app = createApp(App)
const pinia = createPinia()

app.use(router).use(pinia)

app.mount('#app')
