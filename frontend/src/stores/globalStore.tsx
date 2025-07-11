import {defineStore} from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        language: 'en',
        isSidebarMinimized: false as boolean,
    }),
    persist: true,
    actions: {
        setLanguage(language: string) {
            this.language = language;
        },
        clearLanguage() {
            this.language = 'en';
        },
        toggleSidebar() {
            this.isSidebarMinimized = !this.isSidebarMinimized;
        },
    }
})
