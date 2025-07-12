<script setup>
import { RouterView } from 'vue-router'
import { useGlobalStore } from '@/stores/globalStore.tsx'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const globalStore = useGlobalStore()
const { locale } = useI18n()

onMounted(() => {
  document.documentElement.setAttribute('data-theme', globalStore.theme)
  locale.value = globalStore.language
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>