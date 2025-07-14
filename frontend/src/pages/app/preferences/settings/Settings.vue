<template>
  <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('form.field.firstname') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ user.firstname }}
      </div>
    </div>
    <button
        type="button"
        class="w-fit h-fit px-4 py-1 rounded bg-primary text-white font-semibold hover:bg-primary-dark transition"
        @click="emits('openFirstnameModal')"
    >
      {{ t('action.edit') }}
    </button>
  </div>
  <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('form.field.lastname') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ user.lastname }}
      </div>
    </div>
    <button
        type="button"
        class="w-fit h-fit px-4 py-1 rounded bg-primary text-white font-semibold hover:bg-primary-dark transition"
        @click="emits('openNameModal')"
    >
      {{ t('action.edit') }}
    </button>
  </div>
  <hr class="my-4 border-base-300"/>
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('form.field.email') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ user.email }}
      </div>
    </div>
  </div>
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('form.field.password') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">•••••••••••••</div>
    </div>
    <button
        type="button"
        class="w-fit h-fit px-4 py-1 rounded bg-primary text-white font-semibold hover:bg-primary-dark transition"
        @click="emits('openResetPasswordModal')"
    >
      {{ t('action.resetPassword') }}
    </button>
  </div>
  <hr class="my-4 border-base-300"/>
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('preferences.emailSubscriptions.title') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        <p>{{ t('preferences.emailSubscriptions.manage') }}</p>
        <div class="flex space-x-1 w-fit">
          <RouterLink :to="{ name: 'settings' }" class="font-semibold text-primary">
            {{ t('preferences.emailSubscriptions.route') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useAuthStore} from "@/stores/authStore";
import {useI18n} from "vue-i18n";

const store = useAuthStore()
const { t } = useI18n()
const user = computed(() => store.user)

const emits = defineEmits(['openNameModal', 'openFirstnameModal', 'openResetPasswordModal'])
</script>