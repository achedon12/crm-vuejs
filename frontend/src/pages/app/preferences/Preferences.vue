<template>
  <h1 class="text-2xl font-bold mb-4">Preferences</h1>
  <div class="flex flex-col p-4 space-y-10 bg-gray-100 dark:bg-base-300 rounded-lg">
    <div class="flex space-x-5">
      <PreferencesHeader/>
    </div>
    <div class="space-y-4 md:space-y-6">
      <Settings
          @openNameModal="isEditNameModalOpen = true"
          @openFirstnameModal="isEditFirstnameModalOpen = true"
          @openResetPasswordModal="isResetPasswordModalOpen = true"
      />
    </div>
  </div>
  <EditNameModal v-if="isEditNameModalOpen" @cancel="isEditNameModalOpen = false"/>
  <EditFirstnameModal v-if="isEditFirstnameModalOpen" @cancel="isEditFirstnameModalOpen = false"/>
  <ResetPasswordModal v-if="isResetPasswordModalOpen" @cancel="isResetPasswordModalOpen = false"/>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import PreferencesHeader from '@/pages/app/preferences/preferences-header/PreferencesHeader.vue'
import Settings from '@/pages/app/preferences/settings/Settings.vue'
import EditNameModal from '@/pages/app/preferences/modals/EditNameModal.vue'
import EditFirstnameModal from '@/pages/app/preferences/modals/EditFirstnameModal.vue'
import ResetPasswordModal from '@/pages/app/preferences/modals/ResetPasswordModal.vue'

const isEditNameModalOpen = ref(false)
const isEditFirstnameModalOpen = ref(false)
const isResetPasswordModalOpen = ref(false)
</script>