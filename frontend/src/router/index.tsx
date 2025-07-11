import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from "@/pages/admin/Dashboard.vue";
import Login from "@/pages/auth/Login.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import {useAuthStore} from "@/stores/authStore";
import AppLAyout from "../layouts/AppLAyout.vue";
import Preferences from "../pages/preferences/Preferences.vue";
import Settings from "../pages/settings/Settings.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            redirect: {name: '404'},
        },
        {
            name: 'home',
            path: '/',
            redirect: {name: 'dashboard'},
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
            ]
        },
        {
            name: 'admin',
            path: '/admin',
            redirect: {name: 'dashboard'},
            component: AppLAyout,
            beforeEnter: (to, from, next) => {
                const authStore = useAuthStore()
                if (!authStore.user || !authStore.token) {
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
                },
                {
                    name: 'preferences',
                    path: 'preferences',
                    component: Preferences
                },
                {
                    name: 'settings',
                    path: 'settings',
                    component: Settings
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