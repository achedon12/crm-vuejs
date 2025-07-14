<template>
  <div class="flex flex-col justify-center items-center">
    <form @submit.prevent="updateUserAvatar" class="flex flex-col items-center gap-4 w-full">
      <label class="flex flex-col items-center cursor-pointer">
        <input
            type="file"
            accept="image/*,.jpeg,.png"
            class="hidden"
            @change="onFileChange"
        />
        <UserAvatar :avatar="avatarUrl" size="100px"/>
        <div class="flex gap-2 mt-2">
          <button
              v-if="avatar"
              type="submit"
              class="px-3 py-1 rounded bg-primary text-white text-sm flex items-center gap-1"
              style="z-index: 10"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7"/>
            </svg>
            {{ t('action.update') }}
          </button>
          <button
              v-if="avatar"
              class="px-3 py-1 rounded bg-red-500 text-white text-sm flex items-center gap-1"
              style="z-index: 10"
              @click="removeAvatar"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <span
              v-if="!avatar"
              class="px-3 py-1 rounded bg-primary text-white text-sm flex items-center gap-1"
              style="z-index: 10"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 20h9v-9M16.5 3.5l4 4-9 9-4-4 9-9zM19 6l-3 3m0 0l-3-3m3 3l3-3"/>
            </svg>
              {{ t('action.edit') }}
          </span>
        </div>
      </label>
    </form>
    <h2 class="text-[28px] md:text-[32px] leading-10 font-bold mt-4">{{ user.firstname }} {{ user.lastname }}</h2>
    <div class="flex space-x-1 text-[13px] leading-4">
      <p>Membre depuis</p>
      <p>{{ formatDate }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import UserAvatar from '@/components/user/UserAvatar.vue'
import {useI18n} from 'vue-i18n'
import Request from '@/api/Request.js'
import Urls from '@/api/Urls.js'
import {useGlobalStore} from '@/stores/globalStore'
import {useAuthStore} from "@/stores/authStore";
import {useToast} from "vue-toastification";

const store = useAuthStore()
const globalStore = useGlobalStore()
const user = computed(() => store.user)
const avatar = ref<File | undefined>(undefined)
const avatarUrl = computed(() => avatar.value ? URL.createObjectURL(avatar.value) : user.value?.avatar || '')
const {t} = useI18n()
const request = Request()
const toast = useToast()

const language = computed(() => globalStore.language)

const formatDate = computed(() => {
  if (!user.value || !user.value.createdAt) return ''
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString(`${language.value}-${language.value.toUpperCase()}`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    avatar.value = files[0]
  }
}

const removeAvatar = () => {
  avatar.value = undefined
}

const updateUserAvatar = async () => {
  if (!avatar.value) return

  try {
    const formData = new FormData()
    formData.append('image', avatar.value)
    const response = await request.upload(Urls.file.upload, formData)
    if (response.error) {
      toast.error(t('toast.uploadFailed'))
      return;
    }
    avatar.value = undefined
    toast.success(t('toast.uploadSuccess'))
  } catch (error) {
    console.error('Error uploading avatar:', error)
    toast.error(t('toast.uploadFailed'))
  }
}
</script>