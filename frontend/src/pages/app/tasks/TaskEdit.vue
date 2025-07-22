<script setup lang="ts">
import {defineProps, onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useTaskStore} from "@/stores/taskStore";
import Request from '@/api/Request'
import Urls from "@/api/Urls";
import {useToast} from "vue-toastification";
import SpinnerLoader from "@/components/loader/SpinnerLoader.vue";
import {useI18n} from "vue-i18n";

const route = useRoute()
const request = Request()
const taskStore = useTaskStore()
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
                    Par: {{ event.user?.name || 'Système' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenu Commentaires -->
          <div v-if="activeTab === 'comments'" class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="avatar">
                <div class="w-10 rounded-full">
                  <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"/>
                </div>
              </div>
              <div class="flex-1">
                <div class="bg-white p-4 rounded-lg shadow">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium">Jean Dupont</p>
                      <p class="text-xs text-gray-500">12/07/2025 14:30</p>
                    </div>
                    <button class="btn btn-ghost btn-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                  <p class="mt-2 text-sm">J'ai commencé à travailler sur cette tâche, je devrais terminer d'ici
                    demain.</p>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <div class="flex items-start gap-4">
                <div class="avatar">
                  <div class="w-10 rounded-full">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"/>
                  </div>
                </div>
                <div class="flex-1">
                  <textarea
                      class="textarea textarea-bordered w-full"
                      placeholder="Ajouter un commentaire..."
                      rows="3"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button class="btn btn-primary btn-sm">Envoyer</button>
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
