<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  realm: any
}>()
</script>

<template>
  <fieldset class="fieldset bg-base-100 rounded-box p-4">
    <h2 class="text-lg font-bold mb-4">Utilisateurs de {{ realm.name }}</h2>
    <table class="table w-full">
      <thead>
      <tr>
        <th class="w-1/12">Se faire passer pour</th>
        <th>Nom</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in realm.users" :key="user.id">
        <td>
          <button class="material-icons cursor-pointer text-primary btn btn-ghost"
                  @click="$emit('impersonate', user.id)">logout</button>
        </td>
        <td>{{ user.firstname }} {{ user.lastname }}</td>
      </tr>
      <tr v-if="realm.users.length === 0">
        <td colspan="2" class="text-center">Aucun utilisateur</td>
      </tr>
      </tbody>
    </table>
  </fieldset>
</template>