import {defineStore} from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        language: 'en',
        isSidebarMinimized: false as boolean,
        theme: 'light' as 'light' | 'dark',
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
        setTheme(theme: 'light' | 'dark') {
            this.theme = theme;
        },
    }
})
