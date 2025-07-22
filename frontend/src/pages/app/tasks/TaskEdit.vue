<script setup lang="ts">
import {defineProps, onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useTaskStore} from "@/stores/taskStore";
import Request from '@/api/Request'
import Urls from "@/api/Urls";
import {useToast} from "vue-toastification";
import SpinnerLoader from "@/components/loader/SpinnerLoader.vue";
import {useI18n} from "vue-i18n";
import UserAvatar from "@/components/user/UserAvatar.vue";
import {useAuthStore} from "@/stores/authStore";

const route = useRoute()
const request = Request()
const taskStore = useTaskStore()
const authStore = useAuthStore()
const {push} = useRouter()

let isEditing = ref(false)
const activeTab = ref<'history' | 'comments'>('history')

let formData = reactive({
  _id: '',
  title: '',
  description: '',
  state: '',
  priority: '',
  createdAt: '',
  updatedAt: '',
  assigned: '',
  dueDate: ''
})
let isLoading = ref(false)
const comment = ref('')
const toast = useToast()
const {t} = useI18n()

defineProps({
  id: {
    type: String,
    required: false
  }
})
const fetchTask = async (taskId: string) => {
  const response = await request.get(Urls.tasks.get + taskId)

  if (response.status !== 200) {
    toast.error(response.data.message)
    return
  }

  formData = response.data
}

onMounted(async () => {
  isLoading.value = true

  if (route.params.id) {
    isEditing.value = true

    const taskId = route.params.id
    const exists = await taskStore.tasks.find((task) => task._id === taskId)

    if (!exists) {
      await push({name: 'tasks'})
    }
    await fetchTask(taskId)

  }
  isLoading.value = false
})

const displayAction = (action: string, event: any) => {
  switch (action) {
    case 'created':
      return t('task.edit.history.created', {user: event.user?.name || 'Système'});
    case 'updated':
      return t('task.edit.history.updated', {user: event.user?.name || 'Système'});
    case 'assigned':
      return t('task.edit.history.assigned', {user: event.user?.name || 'Système'});
    case 'unassigned':
      return t('task.edit.history.unassigned', {user: event.user?.name || 'Système'});
    case 'state_changed':
      return t('task.edit.history.stateChanged', {user: event.user?.name || 'Système', state: event.state});
    case 'title_changed':
      return t('task.edit.history.titleChanged', {user: event.user?.name || 'Système', title: event.title});
    default:
      return t('task.edit.history.unknown');
  }
}
const handleEdit = async () => {

}

const handleSendComment = async () => {
  try {
    await request.post(Urls.tasks.comment.new, {
      task: route.params.id,
      content: comment.value,
      user: authStore.user._id
    })

    toast.success(t('task.edit. '))
  } catch (error) {
    console.error('Error sending comment:', error)
    toast.error(error.message || t('error.generic'))
  } finally {
    comment.value = ''
    await fetchTask(route.params.id as string)
  }
}

const commentAvatar = (comment: any) => {
  return ``
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 border-t border-gray-200">
    <SpinnerLoader :is-loading="isLoading"/>
    <div v-if="!isLoading" class="mx-auto">
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-primary">{{ t('task.edit.title') }}</h1>
      </header>

      <div class="card shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-2xl font-semibold text-secondary mb-2">{{ formData.title }}</h2>

          <div class="mb-6">
            <p class="text-sm text-white">
              {{ formData.description || t('task.edit.noDescription') }}
            </p>
          </div>

          <div class="divider my-4"></div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('task.edit.state') }}</h3>
              <div class="mt-1">
                <span
                    class="badge badge-lg capitalize"
                    :class="{
                    'badge-info': formData.state === 'submitted',
                    'badge-warning': formData.state === 'in-progress',
                    'badge-success': formData.state === 'completed',
                    'badge-secondary': formData.state === 'submitted',
                  }"
                >
                  {{ formData.state || 'Non défini' }}
                </span>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('task.edit.priority') }}</h3>
              <div class="mt-1">
                <span
                    class="badge badge-lg capitalize"
                    :class="{
                    'badge-error': formData.priority === 'high',
                    'badge-warning': formData.priority === 'medium',
                    'badge-success': formData.priority === 'low'
                  }"
                >
                  {{ formData.priority || 'Non définie' }}
                </span>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('task.edit.createdAt') }}</h3>
              <p class="mt-1 text-white">
                {{ new Date(formData.createdAt).toLocaleDateString() }}
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('task.edit.updatedAt') }}</h3>
              <p class="mt-1 text-white">
                {{ new Date(formData.updatedAt).toLocaleDateString() }}
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('task.edit.assignedAt') }}</h3>
              <p class="mt-1 text-white">
                {{ formData.assigned || t('task.edit.noAssignedAt') }}
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('task.edit.dueDate') }}</h3>
              <p class="mt-1 text-white">
                {{ formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : t('task.edit.noDueDate') }}
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-primary">{{ t('task.edit.activity') }}</h3>
            <div class="tabs tabs-boxed">
              <a
                  class="tab"
                  :class="{'tab-active': activeTab === 'history'}"
                  @click="activeTab = 'history'"
              >
                {{ t('task.edit.history') }}
              </a>
              <a
                  class="tab"
                  :class="{'tab-active': activeTab === 'comments'}"
                  @click="activeTab = 'comments'"
              >
                {{ t('task.edit.comments') }}
              </a>
            </div>
          </div>

          <div v-if="activeTab === 'history'" class="space-y-4">

            <div class="space-y-4 timeline">
              <div
                  v-for="(event, idx) in formData.history"
                  :key="event._id || idx"
                  class="timeline-item pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-gray-200"
              >
                <div class="timeline-marker absolute left-0 top-0 h-3 w-3 rounded-full bg-primary"></div>
                <div class="timeline-content pb-4">
                  <div class="flex justify-between">
                    <p class="font-medium">
                      {{ displayAction(event.action, event) }}
                    </p>
                    <span class="text-sm text-gray-500">
                        {{ new Date(event.createdAt).toLocaleString() }}
                      </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    Par: {{ event?.name || 'Système' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'comments'" class="space-y-4">
            <div
                v-for="(comment, idx) in formData.comments"
                :key="comment._id || idx"
                class="flex items-start gap-4 shadow rounded-lg p-4"
            >
              <div class="avatar">
                <div class="w-10 rounded-full">
                  <img src="/favicon.png" alt="User Avatar" />
                </div>
              </div>
              <div class="flex-1">
                <div class="p-4 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium">{{ comment.user?.firstname + ' ' + comment.user?.lastname || 'Système' }}</p>
                      <p class="text-xs text-gray-500">{{ new Date(comment.createdAt).toLocaleString() }}</p>
                    </div>
                    <!-- Bouton supprimer, à implémenter -->
                  </div>
                  <p class="mt-2 text-sm">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <div class="flex items-start gap-4">
                <UserAvatar size="small" />
                <div class="flex-1">
                  <textarea
                      class="textarea textarea-bordered w-full"
                      placeholder="Ajouter un commentaire..."
                      rows="3"
                      v-model="comment"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button class="btn btn-primary btn-sm" @click="handleSendComment" :disabled="!comment.trim()">
                      {{ t('action.send') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
