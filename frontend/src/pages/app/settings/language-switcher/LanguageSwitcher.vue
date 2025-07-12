<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { availableLanguages } from '@/utils/i18n.tsx'
import { useGlobalStore } from '@/stores/globalStore.tsx'

const globalStore = useGlobalStore()
const { locale } = useI18n()

const model = computed({
  get() {
    return globalStore.language
  },
  set(value: string) {
    const selectedLanguage = availableLanguages.find((lang) => lang.code === value)
    if (selectedLanguage) {
      locale.value = selectedLanguage.code
      globalStore.language = selectedLanguage.code
    }
  },
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="w-40">
      <select
        v-model="model"
        class="select select-bordered w-full"
      >
        <option
          v-for="lang in availableLanguages"
          :key="lang.code"
          :value="lang.code"
        >
          {{ lang.name }}
        </option>
      </select>
    </div>
  </div>
</template>