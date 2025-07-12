<script setup lang="ts">
import ThemeSwitcher from '@/pages/app/settings/theme-switcher/ThemeSwitcher.vue'
import LanguageSwitcher from '@/pages/app/settings/language-switcher/LanguageSwitcher.vue'
import Notifications from '@/pages/app/settings/notifications/Notifications.vue'
import { ref } from 'vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const closeAlert = ref(false)
</script>

<template>
  <div class="flex flex-col space-y-6 md:space-y-4">
    <h1 class="text-3xl font-bold text-center">{{ t('settings.title') }}</h1>
    <div class="flex flex-col p-4 space-y-4 bg-base-200 rounded-lg">
      <h3 class="text-xl font-semibold">{{ t('settings.category.theme') }}</h3>
      <ThemeSwitcher />
    </div>
    <div class="flex flex-col p-4 space-y-4 bg-base-200 rounded-lg">
      <h3 class="text-xl font-semibold">{{ t('settings.category.language') }}</h3>
      <LanguageSwitcher />
    </div>
    <div class="alert alert-info w-full m-auto rounded-lg p-4 flex items-start" v-if="!closeAlert">
      <span class="material-symbols-rounded text-2xl mr-3">notifications_active</span>
      <div class="flex flex-col space-y-2 flex-1">
        <p class="font-bold text-base">
          {{ t('settings.notifications.title') }}
        </p>
        <p class="text-sm">
          {{ t('settings.notifications.description') }}
        </p>
      </div>
      <button class="btn btn-sm btn-circle btn-ghost ml-2" @click="closeAlert = true">&times;</button>
    </div>
    <Notifications />
  </div>
</template>