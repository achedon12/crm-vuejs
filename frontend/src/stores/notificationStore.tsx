import {defineStore} from 'pinia'
import Request from '@/api/Request.tsx'
import Urls from '@/api/Urls.tsx'
import {useAuthStore} from "@/stores/authStore";

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [] as Array<{
            _id: string;
            message: string;
            active: boolean;
        }>
    }),
    persist: true,
    actions: {
        switchNotification(id: string) {
            const notification = this.notifications.find(n => n._id === id);
            if (notification) {
                notification.active = !notification.active;
            }
        },
        async fetchNotifications() {
            const request = Request();
            const authStore = useAuthStore();

            const response = await request.get(Urls.notification.list + `/${authStore.user?._id}`)

            if (response.status === 200) {
                this.notifications = response.data;
            } else {
                console.error('Failed to fetch notifications:', response);
            }
        }
    }
})
