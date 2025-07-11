import {defineStore} from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        language: 'en'
    }),
    persist: true,
    actions: {
        setLanguage(language: string) {
            this.language = language;
        },
        clearLanguage() {
            this.language = 'en';
        }
    }
})
