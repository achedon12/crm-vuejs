import {defineStore} from 'pinia'
import Request from "@/api/Request";
import Urls from "@/api/Urls";
import {useAuthStore} from "@/stores/authStore";
import {computed} from "vue";

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: []
    }),
    persist: true,
    actions: {
        addTask(task) {
            this.tasks.push(task);
        },
        removeTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
        },
        updateTask(updatedTask) {
            const index = this.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
            }
        },
        clearTasks() {
            this.tasks = [];
        },
        async fetchTasks() {
            const request = Request()
            const authStore = useAuthStore()
            const realm = computed(() => authStore.realm)

            const response = await request.get(Urls.tasks.realm + realm.value._id)

            if (response.status === 200) {
                this.tasks = response.data || [];
            }
        }
    }
});