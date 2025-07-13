<script setup lang="ts">
import Grid from '@/components/grid/Grid.vue';
import Request from "@/api/Request";
import {useAuthStore} from "@/stores/authStore";

const request = Request()
const authStore = useAuthStore()

const columns = [
  {key: 'priority', label: 'Priorité', view: (item) => {
    switch (item.priority) {
      case 'low':
        return 'text-muted';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-error';
      default:
        return '';
    }
  }, sortable: true},
  {key: 'title', label: 'Titre', sortable: true},
  {key: 'description', label: 'Description', sortable: true},
  {key: 'state', label: 'État', view: (item) => {
    switch (item.state) {
      case 'submitted':
        return 'badge badge-software badge-info';
      case 'in_progress':
        return 'badge badge-software badge-warning';
      case 'done':
        return 'badge badge-software badge-success';
      case 'archived':
        return 'badge badge-software badge-neutral';
      default:
        return '';
    }
  }},
  {key: 'assigned', label: 'Assigné à', render: (item) => item.assigned ? item.assigned.username : 'Non assigné', sortable: true},
  {key: 'startDate', label: 'Date de début', render: (item) => item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Non défini', sortable: true},
  {key: 'endDate', label: 'Date de fin', render: (item) => item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Non défini', sortable: true},
  {key: 'dueDate', label: 'Date d\'échéance', render: (item) => item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Non défini', sortable: true},
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