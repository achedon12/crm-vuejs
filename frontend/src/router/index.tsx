import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from "@/pages/admin/Dashboard.vue";
import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import {useAuthStore} from "@/stores/authStore";
import {computed} from "vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            redirect: {name: '404'},
        },
        {
            name: 'auth',
            path: '/auth',
            component: AuthLayout,
            redirect: {name: 'login'},
            children: [
                {
                    name: 'login',
                    path: 'login',
                    component: Login
                },
                {
                    name: 'register',
                    path: 'register',
                    component: Register
                }
            ]
        },
        {
            name: 'admin',
            path: '/admin',
            redirect: {name: 'dashboard'},
            beforeEnter: (to, from, next) => {
                const authStore = useAuthStore

                const user = computed(() => authStore.user)
                const token = computed(() => authStore.token)

                if (!user.value || !token.value) {
                    next({name: 'login'})
                } else {
                    next()
                }

            },
            children: [
                {
                    name: 'dashboard',
                    path: 'dashboard',
                    component: Dashboard,
                }
            ]
        },
        {
            path: '/404',
            name: '404',
            component: () => import('@/pages/errors/404.vue'),
        },
        {
            path: '/403',
            name: '403',
            component: () => import('@/pages/errors/403.vue'),
        }
    ]
})

export default router