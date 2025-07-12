<script setup lang="ts">
import {computed, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'

const globalStore = useGlobalStore()

const options = [
  {label: 'Dark', value: 'dark', icon: 'nightlight_round'},
  {label: 'Light', value: 'light', icon: 'wb_sunny'},
]

const theme = computed({
  get: () => globalStore.theme,
  set: (value: string) => {
    globalStore.setTheme(value)
    document.documentElement.setAttribute('data-theme', value)
  },
})

watch(
    () => globalStore.theme,
    (value) => {
      document.documentElement.setAttribute('data-theme', value)
    },
    {immediate: true}
)
</script>

<template>
  <div class="btn-group">
    <button
        v-for="option in options"
        :key="option.value"
        class="btn"
        :class="theme === option.value ? 'btn-primary' : 'btn-outline'"
        @click="theme = option.value"
        type="button"
    >
      <span class="material-symbols-rounded align-middle mr-1">{{ option.icon }}</span>
      {{ option.label }}
    </button>
  </div>
</template>