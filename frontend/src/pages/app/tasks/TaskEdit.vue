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
const editMode = ref(false)

let formData = reactive({
  _id: '',
  title: '',
  description: '',
  state: '',
  priority: '',
  createdAt: '',
  updatedAt: '',
  assigned: '',
  dueDate: '',
  realm: {administrators: []}
})
let isLoading = ref(false)
const isRealmAdministrator = ref(false)
const availableAssignees = ref([])
const comment = ref('')
const toast = useToast()
const {t} = useI18n()

const stateOptions = [
  {value: 'submitted', label: t('task.states.submitted')},
  {value: 'in_progress', label: t('task.states.inProgress')},
  {value: 'completed', label: t('task.states.completed')},
  {value: 'archived', label: t('task.states.archived')},
  {value: 'done', label: t('task.states.done')},
]

const priorityOptions = [
  {value: 'low', label: t('task.priorities.low')},
  {value: 'medium', label: t('task.priorities.medium')},
  {value: 'high', label: t('task.priorities.high')},
  {value: 'critical', label: t('task.priorities.critical')},
]

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

  Object.assign(formData, response.data)
  isRealmAdministrator.value = authStore.user.role === 'admin'
}

const fetchAvailableAssignees = async () => {
  try {
    isLoading.value = true
    const response = await request.get(Urls.realm.assignees.replace('{id}', authStore.user.realm._id))

    if (response.status !== 200) {
      toast.error(response.data?.message || t('error.generic'))
      return
    }
    availableAssignees.value = response.data || []
  } catch (error) {
    toast.error(error.message || t('error.generic'))
  } finally {
    isLoading.value = false
  }
}

const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const saveChanges = async () => {
  try {
    isLoading.value = true
    const response = await request.put(Urls.tasks.update + formData._id, {
      title: formData.title,
      description: formData.description,
      state: formData.state,
      priority: formData.priority,
      dueDate: formData.dueDate,
      assigned: formData.assigned,
    })

    toast.success(t('toast.updateSuccessfully'))
    await fetchTask(formData._id)
    editMode.value = false
  } catch (error) {
    toast.error(error.message || t('error.generic'))
  } finally {
    isLoading.value = false
  }
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
    await fetchAvailableAssignees()
  }
  isLoading.value = false
})

const displayAction = (action: string, event: any) => {
  switch (action) {
    case 'created':
      return t('task.edit.created', {user: event?.user.username || 'Système'});
    case 'updated':
      return t('task.edit.updated', {user: event?.user.username || 'Système'});
    case 'assigned':
      return t('task.edit.assigned', {user: event?.user.username || 'Système'});
    case 'unassigned':
      return t('task.edit.unassigned', {user: event?.user.username || 'Système'});
    case 'state_changed':
      return t('task.edit.stateChanged', {user: event?.user.username || 'Système', state: event.state});
    case 'title_changed':
      return t('task.edit.titleChanged', {user: event?.user.username || 'Système', title: event.title});
    default:
      return t('task.edit.unknown');
  }
}

const handleSendComment = async () => {
  try {
    await request.post(Urls.tasks.comment.new, {
      task: route.params.id,
      content: comment.value,
      user: authStore.user._id
    })

    toast.success(t('task.edit.commentSent'))
    comment.value = ''
    await fetchTask(route.params.id as string)
  } catch (error) {
    console.error('Error sending comment:', error)
    toast.error(error.message || t('error.generic'))
  }
}

</script>

<template>
  <div class="min-h-screen py-8 px-4 border-t border-gray-200">
    <SpinnerLoader :is-loading="isLoading"/>
    <div v-if="!isLoading" class="mx-auto max-w-4xl">
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-primary">{{ t('task.edit.title') }}</h1>
        <div v-if="isRealmAdministrator">
          <button
              v-if="!editMode"
              @click="toggleEditMode"
              class="btn btn-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
            {{ t('action.edit') }}
          </button>
          <div v-else class="flex gap-2">
            <button @click="toggleEditMode" class="btn btn-ghost">
              {{ t('action.cancel') }}
            </button>
            <button @click="saveChanges" class="btn btn-primary">
              {{ t('action.save') }}
            </button>
          </div>
        </div>
      </header>

      <div class="card shadow-lg rounded-lg overflow-hidden bg-base-100">
        <div class="p-6">
          <div class="mb-6">
            <label class="label">
              <span class="label-text">{{ t('task.edit.title') }}</span>
            </label>
            <input
                v-if="editMode && isRealmAdministrator"
                v-model="formData.title"
                type="text"
                class="input input-bordered w-full"
            >
            <h2 v-else class="text-2xl font-semibold text-secondary">{{ formData.title }}</h2>
          </div>

          <div class="mb-6">
            <label class="label">
              <span class="label-text">{{ t('task.edit.description') }}</span>
            </label>
            <textarea
                v-if="editMode && isRealmAdministrator"
                v-model="formData.description"
                class="textarea textarea-bordered w-full"
                rows="3"
            ></textarea>
            <p v-else class="text-sm text-gray-700">
              {{ formData.description || t('task.edit.noDescription') }}
            </p>
          </div>

          <div class="divider my-4"></div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- State -->
            <div>
              <label class="label">
                <span class="label-text">{{ t('task.edit.state') }}</span>
              </label>
              <select
                  v-if="editMode && isRealmAdministrator"
                  v-model="formData.state"
                  class="select select-bordered w-full"
              >
                <option v-for="option in stateOptions" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <div v-else class="mt-1">
                <span
                    class="badge badge-lg capitalize"
                    :class="{
                    'badge-info': formData.state === 'submitted',
                    'badge-warning': formData.state === 'in_progress',
                    'badge-success': formData.state === 'completed',
                    'badge-error': formData.state === 'critical',
                    'badge-secondary': formData.state === 'archived',
                    'badge-primary': formData.state === 'done'
                  }"
                >
                  {{ stateOptions.find(o => o.value === formData.state)?.label || formData.state }}
                </span>
              </div>
            </div>

            <!-- Priority -->
            <div>
              <label class="label">
                <span class="label-text">{{ t('task.edit.priority') }}</span>
              </label>
              <select
                  v-if="editMode && isRealmAdministrator"
                  v-model="formData.priority"
                  class="select select-bordered w-full"
              >
                <option v-for="option in priorityOptions" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <div v-else class="mt-1">
                <span
                    class="badge badge-lg capitalize"
                    :class="{
                    'badge-error': formData.priority === 'high',
                    'badge-warning': formData.priority === 'medium',
                    'badge-success': formData.priority === 'low',
                    'badge-primary': formData.priority === 'critical',
                    'badge-secondary': formData.priority === 'archived'
                  }"
                >
                  {{ priorityOptions.find(o => o.value === formData.priority)?.label || formData.priority }}
                </span>
              </div>
            </div>

            <div>
              <label class="label">
                <span class="label-text">{{ t('task.edit.dueDate') }}</span>
              </label>
              <input
                  v-if="editMode && isRealmAdministrator"
                  v-model="formData.dueDate"
                  type="date"
                  class="input input-bordered w-full"
              >
              <p v-else class="mt-1">
                {{ formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : t('task.edit.noDueDate') }}
              </p>
            </div>

            <div>
              <label class="label">
                <span class="label-text">{{ t('task.edit.createdAt') }}</span>
              </label>
              <p class="mt-1">
                {{ new Date(formData.createdAt).toLocaleDateString() }}
              </p>
            </div>

            <div>
              <label class="label">
                <span class="label-text">{{ t('task.edit.updatedAt') }}</span>
              </label>
              <p class="mt-1">
                {{ new Date(formData.updatedAt).toLocaleDateString() }}
              </p>
            </div>

            <div>
              <label class="label">
                <span class="label-text">{{ t('task.edit.assignedAt') }}</span>
              </label>
              <select
                  v-if="editMode && isRealmAdministrator"
                  v-model="formData.assigned"
                  class="select select-bordered w-full">
                <option value="">{{ t('task.edit.unassigned') }}</option>
                <option v-for="user in availableAssignees" :key="user._id" :value="user._id">
                  {{ user.username }}
                </option>
              </select>
              <p class="mt-1" v-else>
                {{ formData.assigned?.username || t('task.edit.noAssignedAt') }}
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

          <div v-if="activeTab === 'history'" class="relative pl-6">
            <div class="absolute left-0 top-0 h-full w-0.5 bg-gray-200"></div>

            <div v-for="(event, idx) in formData.history" :key="event._id || idx" class="relative pb-6 last:pb-0">
              <div class="absolute -left-5 top-1 -ml-[9px] h-4 w-4 rounded-full border-4 border-white"
                   :class="{
                      'bg-blue-500': event.action === 'created',
                      'bg-purple-500': event.action === 'updated',
                      'bg-green-500': event.action === 'state_changed',
                      'bg-yellow-500': event.action.includes('assigned'),
                      'bg-gray-400': ['title_changed', 'description_changed'].includes(event.action)
                    }"
              ></div>

              <div class="rounded-lg">
                <div class="flex flex-col sm:flex-row sm:items-start gap-2">
                  <div class="text-sm text-secondary w-24 flex-shrink-0">
                    {{ new Date(event.createdAt).toLocaleDateString() }}
                    <div class="text-xs text-gray-500">
                      {{ new Date(event.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
                    </div>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-baseline gap-2">
                      <h3 class="font-medium text-primary">
                        {{ displayAction(event.action, event) }}
                      </h3>
                      <span v-if="event.user" class="text-xs text-gray-500">
                        • {{ event.user.username || 'Système' }}
                      </span>
                    </div>

                    <div v-if="event.action === 'state_changed'" class="mt-1 flex items-center gap-2 text-sm">
                      <span class="text-gray-500">Statut:</span>
                      <span class="badge badge-xs" :class="{
                          'badge-info': event.previousState === 'submitted',
                          'badge-warning': event.previousState === 'in-progress',
                          'badge-success': event.previousState === 'completed',
                          'badge-error': event.previousState === 'critical',
                          'badge-secondary': event.previousState === 'archived',
                          'badge-primary': event.previousState === 'done'
                        }">
                        {{ stateOptions.find(s => s.value === event.previousState)?.label || event.previousState }}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                      </svg>
                      <span class="badge badge-xs" :class="{
                        'badge-info': event.state === 'submitted',
                        'badge-warning': event.state === 'in-progress',
                        'badge-success': event.state === 'completed',
                        'badge-error': event.state === 'critical',
                        'badge-secondary': event.state === 'archived',
                        'badge-primary': event.state === 'done'
                      }">
                        {{ stateOptions.find(s => s.value === event.state)?.label || event.state }}
                      </span>
                    </div>

                    <div v-if="event.action === 'title_changed'" class="mt-1 text-sm text-gray-600">
                      <div class="line-through">{{ event.previousTitle }}</div>
                      <div>{{ event.title }}</div>
                    </div>

                    <div v-if="event.changes" class="mt-2 text-sm bg-gray-50 p-2 rounded">
                      <div v-for="(change, field) in event.changes" :key="field" class="mb-1 last:mb-0">
                        <span class="font-medium capitalize">{{ field }}:</span>
                        <span v-if="change.from" class="text-gray-500 line-through mr-1">{{ change.from }}</span>
                        <span class="text-gray-700">{{ change.to }}</span>
                      </div>
                    </div>
                  </div>
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
                  <img src="/favicon.png" alt="User Avatar"/>
                </div>
              </div>
              <div class="flex-1">
                <div class="p-4 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium">{{
                          comment.user?.username || 'Système'
                        }}</p>
                      <p class="text-xs text-gray-500">{{ new Date(comment.createdAt).toLocaleString() }}</p>
                    </div>
                  </div>
                  <p class="mt-2 text-sm">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <div class="flex items-start gap-4">
                <UserAvatar size="small"/>
                <div class="flex-1">
                  <textarea
                      class="textarea textarea-bordered w-full"
                      :placeholder="t('task.edit.addComment')"
                      rows="3"
                      v-model="comment"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button
                        @click="handleSendComment"
                        :disabled="!comment.trim()"
                        class="btn btn-primary btn-sm"
                    >
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