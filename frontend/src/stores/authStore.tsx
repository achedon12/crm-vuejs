import {defineStore} from 'pinia'
import {User} from "@/utils/interfaces/auth/UserTsx";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        superAdmin: null as User | null,
        token: null,
        keepLoggedIn: false as boolean,
        isSwitched: false as boolean
    }),
    persist: true,
    actions: {
        setUser(user: User | null) {
            this.user = user;
        },
        setSuperAdmin(user: User | null) {
            this.superAdmin = user;
        },
        setToken(token: string | null) {
            this.token = token;
        },
        setKeepLoggedIn(keepLoggedIn: boolean) {
            this.keepLoggedIn = keepLoggedIn;
        },
        setIsSwitched(isSwitched: boolean) {
            this.isSwitched = isSwitched;
        },
        login(user: User, token: string, keepLoggedIn: boolean = false, isSuperAdmin: boolean = false) {
            this.setUser(isSuperAdmin ? null : user);
            this.setSuperAdmin(isSuperAdmin ? user : null);
            this.setToken(token);
            this.setKeepLoggedIn(keepLoggedIn);
            this.setIsSwitched(false);
        },
        impersonate(user: User) {
            this.setUser(user);
            this.setIsSwitched(true);
        },
        logout() {
            if (this.superAdmin && this.isSwitched) {
                this.setUser(null);
                this.setIsSwitched(false);
            } else {
                this.setUser(null);
                this.setSuperAdmin(null);
                this.setToken(null);
                this.setKeepLoggedIn(false);
                this.setIsSwitched(false);
            }
        }
    }
})
