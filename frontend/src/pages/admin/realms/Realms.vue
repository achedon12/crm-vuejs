<script setup lang="ts">
import {onMounted, ref} from 'vue'
import RealmList from './RealmList.vue'
import RealmUsers from './RealmUsers.vue'
import RealmForm from './RealmForm.vue'
import {Realm} from "@/utils/interfaces/Realm";
import Request from "@/api/Request";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from 'vue-router'

const realms = ref<Realm[]>([])
const selectedRealm = ref<Realm | null>(null)
const isAdding = ref(false)
const request = Request()
const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  try {
    const response = await request.get('/realm')
    realms.value = response.data
    if (realms.value.length > 0) {
      selectedRealm.value = realms.value[0];
    }
  } catch (error) {
    console.error('Failed to fetch realms:', error)
  }
})

function handleSelectRealm(realm: any) {
  selectedRealm.value = realm
  isAdding.value = false
}

function handleAddOrEditRealm(realm: Realm) {
  if (realm.id) {
    request.put(`/realm/${realm.id}`, realm)
      .then(response => {
        const index = realms.value.findIndex(r => r._id === response._id)
        if (index !== -1) {
          realms.value[index] = response
          selectedRealm.value = response
          isAdding.value = false
          const tabs = document.querySelectorAll('input[name="my_tabs"]')
          if (tabs.length > 0) {
            tabs[0].checked = true
          }
        } else {
          console.error('Realm not found in the list:', realm.id)
        }
      })
      .catch(error => console.error('Failed to update realm:', error))
  } else {
    request.post('/realm', realm)
      .then(response => {
        realms.value.push(response)
        selectedRealm.value = response
        isAdding.value = false
        selectedRealm.value = response
        const tabs = document.querySelectorAll('input[name="my_tabs"]')
        if (tabs.length > 0) {
          tabs[0].checked = true
        }
      })
      .catch(error => console.error('Failed to add realm:', error))
  }
}

function handleCancel() {
  isAdding.value = false
  selectedRealm.value = realms.value.length > 0 ? realms.value[0] : null
  const tabs = document.querySelectorAll('input[name="my_tabs"]')
  if (tabs.length > 0) {
    tabs[0].checked = true
  }
}

function handleAddRealm() {
  isAdding.value = true
  selectedRealm.value = null
}

function handleImpersonate(userId: string) {
  const user = selectedRealm.value?.users.find(u => u._id === userId)
  authStore.impersonate(user)
  router.push({ name: 'home' })
}

function handleDeleteRealm(realmId: string) {
  request.del(`/realm/${realmId}`)
    .then(() => {
      realms.value = realms.value.filter(r => r._id !== realmId)
      if (realms.value.length > 0) {
        selectedRealm.value = realms.value[0]
      } else {
        selectedRealm.value = null
      }
      const tabs = document.querySelectorAll('input[name="my_tabs"]')
      if (tabs.length > 0) {
        tabs[0].checked = true
      }
    })
    .catch(error => console.error('Failed to delete realm:', error))
}
</script>

<template>
  <div class="flex flex-col md:flex-row h-full gap-4">
    <div class="md:w-1/3 w-full">
      <RealmList
          :realms="realms"
          :selected-realm="selectedRealm"
          @select="handleSelectRealm"
          @add="handleAddRealm"
      />
    </div>
    <div class="md:w-2/3 w-full">
      <div v-if="isAdding">
        <div class="tabs tabs-lift h-full">
          <input type="radio" name="my_tabs" class="tab font-bold" aria-label="Ajout de realm" checked="checked"/>
          <div class="tab-content bg-base-100 border-base-300 p-6">
            <RealmForm :realm="null" @save="handleAddOrEditRealm" @cancel="handleCancel"/>
          </div>
        </div>
      </div>
      <div v-else class="tabs tabs-lift h-full">
        <input type="radio" name="my_tabs" class="tab font-bold" aria-label="Utilisateurs" checked="checked"/>
        <div class="tab-content bg-base-100 border-base-300 p-6">
          <RealmUsers v-if="selectedRealm" :realm="selectedRealm" @impersonate="handleImpersonate"/>
        </div>
        <input type="radio" name="my_tabs" class="tab font-bold" aria-label="Paramètres"/>
        <div class="tab-content bg-base-100 border-base-300 p-6">
          <RealmForm :realm="selectedRealm" @save="handleAddOrEditRealm" @cancel="handleCancel" @delete="handleDeleteRealm"/>
        </div>
      </div>
    </div>
  </div>
</template>