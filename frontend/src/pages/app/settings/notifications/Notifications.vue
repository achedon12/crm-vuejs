<script setup lang="ts">
import {useNotificationStore} from '@/stores/notificationStore.tsx'
import {useI18n} from 'vue-i18n'
import {computed, onMounted} from 'vue'
import Request from '@/api/Request.tsx'
import Urls from '@/api/Urls.tsx'
import {useToast} from "vue-toastification"

const notificationsStore = useNotificationStore()

const fetchNotifications = async () => {
  await notificationsStore.fetchNotifications()
}

onMounted(() => {
  fetchNotifications()
  window.addEventListener('focus', fetchNotifications)
})

const notifications = computed(() => notificationsStore.notifications)
const request = Request()
const {t} = useI18n()
const toast = useToast()

const handleSwitch = async (notification) => {
  const response = await request.post(Urls.notification.switch, {_id: notification._id})

  if (response.error) {
    toast.error(t('settings.notifications.switchError', {name: notification.title}))
    return
  } else {
    toast.success(t('settings.notifications.switchSuccess', {name: notification.title}))
    notificationsStore.switchNotification(notification)
  }
}
</script>

<template>
  <form class="flex flex-col p-4 bg-base-200 rounded-lg">
    <h3 class="text-xl font-semibold mb-6">{{ t('settings.category.notifications') }}</h3>
    <div v-for="(notification, index) in notifications" :key="notification.name" class="group">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <h4 class="text-base font-bold">
            {{ notification.title }}
          </h4>
          <p>{{ notification.message }}</p>
        </div>
        <label class="swap swap-rotate">
          <input
              type="checkbox"
              :checked="notification.active"
              @change="handleSwitch(notification)"
              class="hidden"
          />
          <span class="swap-on">
                      <span class="inline-block w-10 h-6 bg-primary rounded-full relative transition">
                        <span class="absolute left-5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition"></span>
                      </span>
                    </span>
          <span class="swap-off">
                      <span class="inline-block w-10 h-6 bg-gray-300 rounded-full relative transition">
                        <span class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition"></span>
                      </span>
                    </span>
        </label>
      </div>
      <div class="border-b border-base-300 py-4" v-if="index < notifications.length - 1"></div>
    </div>
  </form>
</template>