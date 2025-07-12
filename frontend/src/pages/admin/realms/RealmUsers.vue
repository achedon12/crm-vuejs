<script setup lang="ts">
import {defineEmits, defineProps} from 'vue'

defineProps<{
  realm: any
}>();
defineEmits(['impersonate']);


</script>

<template>
  <div v-if="realm" class="bg-base-100">
    <table class="table w-full">
      <thead>
      <tr>
        <th class="w-1/12">Se faire passer pour</th>
        <th>Pseudo</th>
        <th>Nom</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in realm.users" :key="user._id">
        <td>
          <button class="material-icons cursor-pointer text-primary btn btn-ghost"
                  @click="$emit('impersonate', user._id)">
            login
          </button>
        </td>
        <td>{{ user.username }}</td>
        <td>{{ user.firstname }} {{ user.lastname }}</td>
      </tr>
      <tr v-if="realm.users?.length === 0">
        <td colspan="2" class="text-center">Aucun utilisateur</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>