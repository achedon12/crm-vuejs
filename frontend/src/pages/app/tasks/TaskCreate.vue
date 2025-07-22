<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import Request from '@/api/Request'
import Urls from "@/api/Urls"
import {useToast} from "vue-toastification"
import {useI18n} from "vue-i18n"
import SpinnerLoader from "@/components/loader/SpinnerLoader.vue"
import {useAuthStore} from "@/stores/authStore";

const {t} = useI18n()
const router = useRouter()
const toast = useToast()
const request = Request()
const authStore = useAuthStore()

const isLoading = ref(false)

const formData = ref({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  assignedTo: ''
})
const availableAssignees = ref([])

const priorityOptions = [
  {value: 'low', label: t('task.priorities.low')},
  {value: 'medium', label: t('task.priorities.medium')},
  {value: 'high', label: t('task.priorities.high')},
  {value: 'critical', label: t('task.priorities.critical')}
]

onMounted(async () => {
  try {
    isLoading.value = true
    const response = await request.get(Urls.realm.assignees.replace('{id}', authStore.user.realm._id))

    if (response.status !== 200) {
      toast.error(response.data?.message || t('error.generic'))
    }
    availableAssignees.value = response.data || []
  } catch (error) {
    toast.error(error.message || t('error.generic'))
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  if (!formData.value.title.trim()) {
    toast.error(t('task.create.titleRequired'))
    return
  }

  try {
    isLoading.value = true

    await request.post(Urls.tasks.new, {
      title: formData.value.title,
      description: formData.value.description,
      priority: formData.value.priority,
      dueDate: formData.value.dueDate || null,
      assigned: formData.value.assignedTo || null
    })

    toast.success(t('toast.createSuccessfully'))
    await router.push({name: 'tasks'})
  } catch (error) {
    toast.error(error.message || t('error.generic'))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center mb-8">
        <button
            @click="router.go(-1)"
            class="btn btn-ghost btn-circle mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
        <h1 class="text-3xl font-bold text-primary">{{ t('task.create.title') }}</h1>
      </div>

      <SpinnerLoader :is-loading="isLoading"/>

      <div class="card shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="label">
                <span class="label-text text-secondary">{{ t('form.field.title') }} *</span>
              </label>
              <input
                  v-model="formData.title"
                  type="text"
                  class="input input-bordered w-full"
                  :placeholder="t('form.placeholder.title')"
              >
            </div>

            <div>
              <label class="label">
                <span class="label-text text-secondary">{{ t('form.field.description') }} *</span>
              </label>
              <textarea
                  v-model="formData.description"
                  required
                  class="textarea textarea-bordered w-full h-32"
                  :placeholder="t('form.placeholder.description')"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="label">
                  <span class="label-text text-secondary">{{ t('form.field.priority') }}</span>
                </label>
                <select
                    v-model="formData.priority"
                    class="select select-bordered w-full"
                >
                  <option disabled value="" selected>{{ t('form.placeholder.priority') }}</option>
                  <option
                      v-for="option in priorityOptions"
                      :value="option.value"
                      :key="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="label">
                  <span class="label-text text-secondary">{{ t('form.field.dueDate') }}</span>
                </label>
                <input
                    v-model="formData.dueDate"
                    type="date"
                    class="input input-bordered w-full"
                >
              </div>
            </div>

            <div>
              <label class="label">
                <span class="label-text text-secondary">{{ t('form.field.assigned') }}</span>
              </label>
              <select
                  v-model="formData.assignedTo"
                  class="select select-bordered w-full"
                  :placeholder="t('form.placeholder.assigned')"
              >
                <option value="" disabled selected>{{ t('form.placeholder.assigned') }}</option>
                <option
                    v-for="assignee in availableAssignees"
                    :value="assignee._id"
                    :key="assignee._id"
                >
                  {{ assignee.username }}
                </option>
              </select>
            </div>

            <div class="flex justify-end space-x-4 pt-4">
              <button
                  type="button"
                  @click="router.go(-1)"
                  class="btn btn-ghost"
              >
                {{ t('action.cancel') }}
              </button>
              <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!formData.title.trim() || !formData.description.trim()"
              >
                {{ t('action.add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>