import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from "@/stores/authStore";
import LoginLayout from "@/layouts/LoginLayout.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import Login from "@/pages/login/Login.vue";
import Dashboard from "@/pages/app/dashboard/Dashboard.vue";
import Tasks from "@/pages/app/tasks/Tasks.vue";
import Preferences from "@/pages/app/preferences/Preferences.vue";
import RealmAdministration from "@/pages/app/realm-administration/RealmAdministration.vue";
import Settings from "@/pages/app/settings/Settings.vue";
import Realms from "@/pages/admin/realms/Realms.vue";
import TaskEdit from "@/pages/app/tasks/TaskEdit.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            redirect: {name: '404'},
        },
        {
            path: '/login',
            redirect: {name: 'login'},
            component: LoginLayout,
            beforeEnter: (to, from, next) => {
                const authStore = useAuthStore()
                if (authStore.user && authStore.token) {
                    if (authStore.superAdmin) {
                        next({name: 'admin'})
                    } else {
                        next({name: 'home'})
                    }
                } else {
                    next()
                }
            },
            children: [
                {
                    name: 'login',
                    path: '',
                    component: Login
                },
            ]
        },
        {
            name: 'admin',
            path: '/admin',
            redirect: {name: 'realms'},
            component: AdminLayout,
            beforeEnter: (to, from, next) => {
                const authStore = useAuthStore()
                if (!authStore.user && !authStore.token && !authStore.superAdmin) {
                    next({name: 'login'})
                } else if (!authStore.superAdmin) {
                    next({name: 'home'})
                } else {
                    next()
                }
            },
            children: [
                {
                    name: 'realms',
                    path: 'realms',
                    component: Realms,
                },
            ]
        },
        {
            name: 'home',
            path: '/',
            redirect: {name: 'dashboard'},
            component: AppLayout,
            beforeEnter: (to, from, next) => {
                const authStore = useAuthStore()
                if (!authStore.user || !authStore.token || (authStore.superAdmin && !authStore.isSwitched)) {
                    next({name: 'login'})
                } else if (authStore.superAdmin && !authStore.isSwitched) {
                    next({name: 'admin'})
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
                    name: 'tasks',
                    path: 'tasks',
                    redirect: {name: 'tasks-list'},
                    children: [
                        {
                            name: 'tasks-list',
                            path: 'list',
                            component: Tasks,
                        },
                        {
                            name: 'create-task',
                            path: 'create',
                            component: TaskEdit
                        },
                        {
                            name: 'edit-task',
                            path: ':id',
                            props: true,
                            component: TaskEdit
                        }
                    ]
                },
                {
                    name: 'preferences',
                    path: 'preferences',
                    component: Preferences
                },
                {
                    name: 'realm-administration',
                    path: 'realm-administration',
                    component: RealmAdministration
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