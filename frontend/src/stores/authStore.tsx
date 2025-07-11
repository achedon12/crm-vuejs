import {defineStore} from 'pinia'
import {User} from "../utils/interfaces/auth/UserTsx";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null,
        keepLoggedIn: false as boolean,
        isSuperAdmin: false as boolean
    }),
    persist: true,
    actions: {
        setUser(user: User | null) {
            this.user = user;
        },
        setToken(token: string | null) {
            this.token = token;
        },
        clearAuth() {
            this.user = null;
            this.token = null;
        },
        setKeepLoggedIn(keepLoggedIn: boolean) {
            this.keepLoggedIn = keepLoggedIn;
        },
        setIsSuperAdmin(isSuperAdmin: boolean) {
            if (this.user) {
                this.user.isSuperAdmin = isSuperAdmin;
            }
        }
    }
})
