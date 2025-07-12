<script setup lang="ts">
import {ref, computed, defineProps, defineEmits} from 'vue'

const props = defineProps<{
  realms: Array<any>,
  selectedRealm: any
}>()
const emit = defineEmits(['select', 'add'])

const search = ref('')

const filteredRealms = computed(() =>
    props.realms.filter(r =>
        r.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

function selectRealm(realm: any) {
  emit('select', realm)
}

function addRealm() {
  emit('add')
}
</script>

<template>
  <div class="bg-base-200 rounded-box p-8 h-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold">Realms</h2>
      <button class="btn btn-circle material-symbols-rounded btn-secondary" @click="addRealm">add</button>
    </div>
    <div class="flex flex-col">
      <input
          v-model="search"
          type="text"
          placeholder="Rechercher un realm"
          class="input input-bordered w-full mb-4"
      />
      <ul class="list">
        <li v-for="realm in filteredRealms" :key="realm._id" class="list-row cursor-pointer font-bold hover:text-primary"
            @click="selectRealm(realm)" :class="{'bg-base-100 text-primary': realm._id === props.selectedRealm?._id}">
          {{ realm.name }}
        </li>
      </ul>
    </div>
  </div>
</template>