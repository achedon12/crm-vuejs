<script setup lang="ts">
import Grid from '@/components/grid/Grid.vue';
import Request from "@/api/Request";
import {useAuthStore} from "@/stores/authStore";

const request = Request()
const authStore = useAuthStore()

const columns = [
  {key: 'priority', label: 'Priorité'},
  {key: 'title', label: 'Titre'},
  {key: 'description', label: 'Description'},
  {key: 'state', label: 'État'},
  {key: 'assigned', label: 'Assigné à'},
  {key: 'startDate', label: 'Date de début'},
  {key: 'endDate', label: 'Date de fin'},
  {key: 'dueDate', label: 'Date d\'échéance'},
];

const fetchTasks = async () => {
  const res = await request.get('/task/realm/' + authStore.realm._id)
  return res.data;
};
</script>

<template>
  <div class="bg-base-100 shadow-lg rounded-lg p-4 h-full">
    <Grid :columns="columns" :fetchData="fetchTasks"/>
  </div>
</template>