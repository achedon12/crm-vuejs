import {useAuthStore} from "@/stores/authStore";
import {computed} from "vue";
import {defineStore} from "pinia";
import Request from "@/api/Request";
import Urls from "@/api/Urls";

export const useUserStore = defineStore('user', {
    state: () => ({
        users: null,
    }),
    persist: true,
    actions: {
        addUser(user) {
            if (!this.users) {
                this.users = [];
            }
            this.users.push(user);
        },
        removeUser(userId) {
            if (!this.users) return;
            this.users = this.users.filter(user => user.id !== userId);
        },
        updateUser(updatedUser) {
            if (!this.users) return;
            const index = this.users.findIndex(user => user.id === updatedUser.id);
            if (index !== -1) {
                this.users[index] = updatedUser;
            }
        },
        clearUsers() {
            this.users = [];
        },
        async fetchUsers() {
            const request = Request();
            const authStore = useAuthStore();
            const realm = computed(() => authStore.realm);

            const response = await request.get(Urls.account.getFromRealm + realm.value._id);

            if (response.status === 200) {
                this.users = response.data || [];
            }
        }
    }
});