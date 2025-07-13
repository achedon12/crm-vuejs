import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Toast from "vue-toastification"
import router from './router'
import i18n from '@/utils/i18n.js'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import "vue-toastification/dist/index.css"

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Toast)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app')