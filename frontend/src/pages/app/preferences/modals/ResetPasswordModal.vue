<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative">
      <button
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          @click="emits('cancel')"
          aria-label="Fermer"
      >
        &times;
      </button>
      <h1 class="text-lg font-bold mb-4 text-primary">{{ t('action.resetPassword') }}</h1>
      <form @submit.prevent="submit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
              v-model="oldPassword"
              type="password"
              required
              class="border rounded px-3 py-2 w-full focus:ring-primary text-primary"
              :placeholder="t('preferences.resetPassword.oldPassword')"
          />
          <div class="hidden md:block"></div>
          <input
              v-model="newPassword"
              type="password"
              required
              class="border rounded px-3 py-2 w-full focus:ring-primary text-primary"
              :placeholder="t('preferences.resetPassword.newPassword')"
          />
          <input
              v-model="repeatNewPassword"
              type="password"
              required
              class="border rounded px-3 py-2 w-full focus:ring-primary text-primary"
              :placeholder="t('preferences.resetPassword.repeatNewPassword')"
          />
        </div>
        <div class="flex flex-col space-y-2">
          <div class="flex space-x-2 items-center">
              <span>
                <svg v-if="newPassword.length >= 8" class="text-green-500" width="20" height="20"
                     fill="currentColor">
                  <path d="M7 13l3 3 7-7"/>
                </svg>
                <svg v-else class="text-red-500" width="20" height="20" fill="none" stroke="currentColor">
                  <circle cx="10" cy="10" r="9" stroke-width="2"/>
                  <line x1="6" y1="6" x2="14" y2="14" stroke-width="2"/>
                  <line x1="14" y1="6" x2="6" y2="14" stroke-width="2"/>
                </svg>
              </span>
            <p class="text-primary">
              {{ t('preferences.resetPassword.conditions.minLength') }}
            </p>
          </div>
          <div class="flex space-x-2 items-center">
            <span>
              <svg v-if="uniqueChars(newPassword) >= 6" class="text-green-500" width="20" height="20"
                   fill="currentColor">
                <path d="M7 13l3 3 7-7"/>
              </svg>
              <svg v-else class="text-red-500" width="20" height="20" fill="none" stroke="currentColor"><circle
                  cx="10" cy="10" r="9" stroke-width="2"/>
                <line x1="6" y1="6" x2="14" y2="14" stroke-width="2"/>
                <line x1="14" y1="6" x2="6" y2="14" stroke-width="2"/>
              </svg>
            </span>
            <p class="text-primary">
              {{ t('preferences.resetPassword.conditions.uniqueChars') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col-reverse md:justify-end md:flex-row md:space-x-4">
          <button
              type="button"
              class="mt-2 md:mt-0 px-4 py-2 rounded border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200"
              @click="emits('cancel')"
          >
            {{ t('action.cancel') }}
          </button>
          <button
              type="submit"
              class="mb-4 md:mb-0 px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
          >
            {{ t('action.changePassword') }}
          </button>
        </div>
        <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useI18n} from "vue-i18n";
import Request from "@/api/Request";
import Urls from "@/api/Urls";
import {useToast} from "vue-toastification";
import {useAuthStore} from "@/stores/authStore";

const emits = defineEmits(['cancel'])

const oldPassword = ref('')
const newPassword = ref('')
const repeatNewPassword = ref('')
const error = ref('')
const {t} = useI18n()
const request = Request()
const toast = useToast()
const store = useAuthStore()

const uniqueChars = (str: string) => {
  return new Set(str).size
}

const submit = async () => {
  error.value = ''
  if (!oldPassword.value || !newPassword.value || !repeatNewPassword.value) {
    error.value = t('form.required.allFields')
    return
  }
  if (newPassword.value.length < 8) {
    error.value = t('preferences.resetPassword.conditions.minLength')
    return
  }
  if (uniqueChars(newPassword.value) < 6) {
    error.value = t('preferences.resetPassword.conditions.uniqueChars')
    return
  }
  if (newPassword.value !== repeatNewPassword.value) {
    error.value = t('form.invalid.passwords')
    return
  }

  const response = await request.put(Urls.auth.updatePassword, {
    currentPassword: oldPassword.value,
    newPassword: newPassword.value
  });

  if (response.error) {
    toast.error(response.error);
    return
  }

  toast.success(t('toast.updateSuccessfully'));
  store.setUser(response.user)

  emits('cancel')
}
</script>