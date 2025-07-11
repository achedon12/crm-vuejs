import router from '@/router/index.tsx'
import axios from 'axios'
import Urls from '@/api/Urls.tsx'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore.tsx'
import {useGlobalStore} from "@/stores/globalStore";

const api = axios.create({
    baseURL: '/api',
})

api.interceptors.request.use((config) => {
    const store = useAuthStore()
    const globalStore = useGlobalStore()

    const token = computed(() => store.token)
    const language = computed(() => globalStore.language)
    if (token.value) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token.value}`,
            'Content-Type': 'multipart/form-data',
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            'Accept-Language': language.value || 'en',
        }
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const store = useAuthStore()

        if (error.response.status === 401 && store.keepLoggedIn) {
            originalRequest._retry = true

            try {
                const response = await api.post(Urls.auth.refresh, {
                    refresh: store.refreshToken,
                })

                store.setToken(response.data.success.token, response.data.success.refreshToken)
                originalRequest.headers.Authorization = `Bearer ${response.data.success.token}`
                return api(originalRequest)
            } catch (refreshError) {
                await store.logout()
                await router.push({ name: 'login' })
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    },
)

export default api;