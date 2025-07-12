import {defineStore} from 'pinia'
import {User} from "@/utils/interfaces/User";
import {Realm} from "@/utils/interfaces/Realm";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        superAdmin: null as User | null,
        token: null,
        keepLoggedIn: false as boolean,
        isSwitched: false as boolean,
        realm: null as Realm | null,
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
        setRealm(realm: Realm | null) {
            this.realm = realm;
        },
        login(user: User, token: string, keepLoggedIn: boolean = false, isSuperAdmin: boolean = false) {
            this.setUser(isSuperAdmin ? null : user);
            this.setSuperAdmin(isSuperAdmin ? user : null);
            this.setToken(token);
            this.setKeepLoggedIn(keepLoggedIn);
            this.setIsSwitched(false);
            this.setRealm(user.realm || null);
        },
        impersonate(user: User) {
            this.setUser(user);
            this.setIsSwitched(true);
            this.setRealm(user.realm || null);
        },
        logout() {
            if (this.superAdmin && this.isSwitched) {
                this.setUser(null);
                this.setIsSwitched(false);
                this.setRealm(null);
            } else {
                this.setUser(null);
                this.setSuperAdmin(null);
                this.setToken(null);
                this.setKeepLoggedIn(false);
                this.setIsSwitched(false);
                this.setRealm(null);
            }
        }
    }
})
