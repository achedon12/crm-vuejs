<script setup lang="ts">
import { ref } from 'vue'
import RealmList from './RealmList.vue'
import RealmUsers from './RealmUsers.vue'

const realms = ref([
  { id: 1, name: 'Realm 1', users: [{ id: 1, firstname: 'Alice', lastname: 'Smith' }, { id: 2, firstname: 'Bob', lastname: 'Johnson' }] },
  { id: 2, name: 'Realm 2', users: [{ id: 3, firstname: 'Charlie', lastname: 'Brown' }, { id: 4, firstname: 'David', lastname: 'Williams' }] },
  { id: 3, name: 'Realm 3', users: [] },
  { id: 4, name: 'Realm 4', users: [{ id: 5, firstname: 'Eve', lastname: 'Davis' }] },
])

const selectedRealm = ref(realms.value[0])

function handleSelectRealm(realm: any) {
  selectedRealm.value = realm
}
</script>

<template>
  <div class="flex flex-col md:flex-row h-full gap-4">
    <div class="md:w-1/3 w-full">
      <RealmList
          :realms="realms"
          :selected-realm="selectedRealm"
          @select="handleSelectRealm"
      />
    </div>
    <div class="md:w-2/3 w-full">
      <RealmUsers :realm="selectedRealm" />
    </div>
  </div>
</template>

<style scoped>
div[h-full] {
  min-height: 60vh;
}
</style>