<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  realms: Array<any>,
  selectedRealm: any
}>()

const emit = defineEmits(['select'])

function selectRealm(realm: any) {
  emit('select', realm)
}
</script>

<template>
  <div class="bg-base-200 rounded-box p-4 h-full">
    <h2 class="text-lg font-bold mb-4">Realms</h2>
    <ul class="space-y-2">
      <li v-for="realm in realms" :key="realm.id">
        <button
            class="btn btn-block"
            :class="{ 'btn-primary': selectedRealm.id === realm.id }"
            @click="selectRealm(realm)"
        >
          {{ realm.name }}
        </button>
      </li>
    </ul>
  </div>
</template>