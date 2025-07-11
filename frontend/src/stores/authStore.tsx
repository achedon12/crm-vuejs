import {defineStore} from 'pinia'
import {User} from "@/utils/interfaces/auth/UserTsx";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null,
        keepLoggedIn: false as boolean,
        isSuperAdmin: false as boolean,
        isSwitched: false as boolean
    }),
    persist: true,
    actions: {
        setUser(user: User | null) {
            this.user = user;
        },
        setToken(token: string | null) {
            this.token = token;
        },
        setKeepLoggedIn(keepLoggedIn: boolean) {
            this.keepLoggedIn = keepLoggedIn;
        },
        setIsSuperAdmin(isSuperAdmin: boolean) {
            this.isSuperAdmin = isSuperAdmin;
        },
        setIsSwitched(isSwitched: boolean) {
            this.isSwitched = isSwitched;
        },
        login(user: User, token: string, keepLoggedIn: boolean = false, isSuperAdmin: boolean = false) {
            this.setUser(user);
            this.setToken(token);
            this.setKeepLoggedIn(keepLoggedIn);
            this.setIsSuperAdmin(isSuperAdmin);
            this.setIsSwitched(false);
        },
        logout() {
            this.setUser(null);
            this.setToken(null);
            this.setKeepLoggedIn(false);
            this.setIsSuperAdmin(false);
            this.setIsSwitched(false);
        }
    }
})
