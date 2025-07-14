<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-xs p-6 relative">
      <button
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          @click="emits('cancel')"
          aria-label="Fermer"
      >
        &times;
      </button>
      <h1 class="text-lg font-bold mb-4 text-primary">Changer le nom</h1>
      <form @submit.prevent="submit">
        <input
            v-model="lastname"
            class="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-primary text-primary"
            placeholder="Nom"
        />
        <div class="flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-4">
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
            {{ t('action.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useAuthStore} from '@/stores/authStore.jsx'
import {useI18n} from "vue-i18n";
import {useToast} from "vue-toastification";
import Urls from "@/api/Urls";
import Request from "@/api/Request";

const store = useAuthStore()
const emits = defineEmits(['cancel'])
const {t} = useI18n()
const request = Request()
const lastname = ref(store.user.lastname)
const toast = useToast()

const submit = async () => {
  if (!lastname.value || lastname.value === store.user.lastname) {
    emits('cancel')
    return
  }
  const response = await request.put(Urls.account.update + store.user._id, {
    ...store.user, lastname: lastname.value, realm : store.user.realm._id
  })

  if (response.error) {
    toast.error(response.error);
    return
  }
  store.setUser(response)
  toast.success(t('toast.updateSuccessfully'))
  emits('cancel')
}
</script>