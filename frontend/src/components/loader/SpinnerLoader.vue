<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  color: {
    type: String,
    default: 'primary',
  },
})

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
}
</script>

<template>
  <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 gap-4">
    <svg
      :class="['animate-spin', `text-${color}`, sizeClasses[size]]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <div class="text-center space-y-1">
      <p class="text-gray-700 font-medium">{{ t('loading.message') }}</p>
      <p class="text-sm text-gray-500">{{ t('loading.subMessage') }}</p>
    </div>
  </div>
</template>
