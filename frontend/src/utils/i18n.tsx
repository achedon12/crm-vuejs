import { createI18n } from 'vue-i18n'
import ENMessages from '@/utils/languages/en.js'
import FRMessages from '@/utils/languages/fr.js'

const messages = {
  en: ENMessages,
  fr: FRMessages,
}

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
]

const i18n = createI18n({
  locale: 'en', // default locale
  fallbackLocale: 'en', // fallback locale
  messages,
})

export { availableLanguages }

export default i18n
