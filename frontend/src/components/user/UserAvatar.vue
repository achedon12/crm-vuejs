<script setup lang="ts">
import {useAuthStore} from '@/stores/authStore'
import {computed, defineProps, onMounted, reactive, ref, watch} from 'vue'
import Request from '@/api/Request.js'

const store = useAuthStore()
const user = computed(() => store.user)
let userImage = reactive('')
const request = Request()

const props = defineProps({
  size: {
    type: String,
    default: 'large',
    required: false,
  },
  avatar: {
    type: String,
    default: null,
    required: false
  },
  creating: {
    type: Boolean,
    default: false,
    required: false
  }
})

const sizePx = computed(() => {
  if (props.size === 'small') return 40
  if (props.size === 'large') return 100
  if (props.size?.endsWith('px')) return parseInt(props.size)
  return 64
})

const fallbackText = computed(() => {
  if (!user.value) return ''
  return (user.value.firstname || '') + ' ' + (user.value.name || '')
})

const showFallback = ref(false)

const updateAvatar = async () => {
  showFallback.value = false
  if (props.creating || !user.value) {
    userImage = '/favicon.png'
    return
  }
  const apiUrl = 'http://localhost:3000'
  const timestamp = new Date().getTime()
  const imageUrl = `/user/${userId.value}.jpeg?t=${timestamp}`
  let exists = true;
  try {
    exists = await request.imageExists(`${apiUrl}${imageUrl}`)
  } catch (error) {
    exists = false
  }
  userImage = exists ? `${apiUrl}${imageUrl}?t=${timestamp}` : `/favicon.png`
}

onMounted(() => {
  updateAvatar()
  window.addEventListener('focus', updateAvatar)
})

const userId = computed(() => user.value?._id || '')

watch(() => user.value?.userId, updateAvatar)
</script>

<template>
  <div
      class="flex items-center justify-center rounded-full bg-yellow-100 overflow-hidden"
      :style="{ width: sizePx + 'px', height: sizePx + 'px' }"
  >
    <img
        v-if="!showFallback"
        :src="props.avatar ? props.avatar : userImage"
        :alt="fallbackText"
        :style="{ width: sizePx + 'px', height: sizePx + 'px', objectFit: 'cover' }"
        @error="showFallback = true"
    />
    <span
        v-else
        class="text-gray-700 font-bold text-center w-full"
        :style="{ fontSize: (sizePx / 3) + 'px' }"
    >
          {{ fallbackText }}
        </span>
  </div>
</template>