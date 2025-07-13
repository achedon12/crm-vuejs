<script setup lang="ts">
import {ref, onMounted, watchEffect} from 'vue'
import Request from "@/api/Request";
import {useAuthStore} from "@/stores/authStore";
import Chart from 'primevue/chart';
import dayjs from 'dayjs'

const request = Request()
const authStore = useAuthStore()

const stats = ref({
  totalTasks: 0,
  completedTasks: 0,
  inProgressTasks: 0,
  archivedTasks: 0,
  pendingTasks: 0,

  myTotalTasks: 0,
  myCompletedTasks: 0,
  myInProgressTasks: 0,
  myArchivedTasks: 0,
  myPendingTasks: 0,

  myTasksOverLast3Months: [],
  usersOfMyRealm: []
})
const pieData = ref()
const lineData = ref()
const pieOptions = ref({
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})
const lineOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Mes tâches au cours des 3 derniers mois'
    }
  }
})

onMounted(async () => {
  try {
    const res = await request.get('/realm/statistics/' + authStore.realm._id + '/' + authStore.user._id)
    console.log(res)
    if (res.status === 200) {
      stats.value = {
        totalTasks: res.data.totalTasks,
        completedTasks: res.data.completedTasks,
        inProgressTasks: res.data.inProgressTasks,
        archivedTasks: res.data.archivedTasks,
        pendingTasks: res.data.pendingTasks,

        myTotalTasks: res.data.myTotalTasks,
        myCompletedTasks: res.data.myCompletedTasks,
        myInProgressTasks: res.data.myInProgressTasks,
        myArchivedTasks: res.data.myArchivedTasks,
        myPendingTasks: res.data.myPendingTasks,

        myTasksOverLast3Months: res.data.myTasksOverLast3Months,

        usersOfMyRealm: res.data.usersOfMyRealm
      }
      console.log('Statistiques des tâches récupérées avec succès:', stats.value)
    } else {
      console.error('Erreur lors de la récupération des statistiques des tâches:', res.statusText)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des tâches:', error)
  }
})

watchEffect(() => {
  pieData.value = {
    labels: ['Terminées', 'En cours', 'Archivées', 'En attente'],
    datasets: [
      {
        data: [
          stats.value.myCompletedTasks,
          stats.value.myInProgressTasks,
          stats.value.myArchivedTasks,
          stats.value.myPendingTasks
        ],
        backgroundColor: [
          '#22c55e',
          '#3b82f6',
          '#ef4444',
          '#f59e42'
        ]
      }
    ]
  }

  const months = []
  for (let i = 2; i >= 0; i--) {
    months.push(dayjs().subtract(i, 'month').format('YYYY-MM'))
  }

  const submittedPerMonth = months.map(month =>
      stats.value.myTasksOverLast3Months.filter(t => dayjs(t.createdAt).format('YYYY-MM') === month).length
  )
  const completedPerMonth = months.map(month =>
      stats.value.myTasksOverLast3Months.filter(t => t.endDate && dayjs(t.endDate).format('YYYY-MM') === month).length
  )
  lineData.value = {
    labels: months,
    datasets: [
      {
        label: 'Tâches soumises',
        data: submittedPerMonth,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f688',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Tâches terminées',
        data: completedPerMonth,
        borderColor: '#22c55e',
        backgroundColor: '#22c55e88',
        fill: false,
        tension: 0.1
      }
    ]
  }
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 grid-rows-5 gap-6 h-full">
    <div class="stat bg-base-100 shadow rounded">
      <div class="stat-title">Total des tâches</div>
      <div class="stat-value text-primary">{{ stats.totalTasks }}</div>
    </div>
    <div class="stat bg-base-100 shadow rounded">
      <div class="stat-title">Terminées</div>
      <div class="stat-value text-success">{{ stats.completedTasks }}</div>
    </div>
    <div class="stat bg-base-100 shadow rounded">
      <div class="stat-title">En cours</div>
      <div class="stat-value text-info">{{ stats.inProgressTasks }}</div>
    </div>
    <div class="stat bg-base-100 shadow rounded">
      <div class="stat-title">Archivées</div>
      <div class="stat-value text-error">{{ stats.archivedTasks }}</div>
    </div>
    <div class="stat bg-base-100 shadow rounded">
      <div class="stat-title">En attente</div>
      <div class="stat-value text-warning">{{ stats.pendingTasks }}</div>
    </div>

    <div class="bg-base-100 shadow rounded col-span-1 row-span-2">
      <Chart type="pie" :data="pieData" :options="pieOptions"/>
    </div>
    <div class="bg-base-100 shadow rounded col-span-2 row-span-2">
      <Chart type="line" :data="lineData" :options="lineOptions"/>
    </div>
    <div class="bg-base-100 shadow rounded col-span-2 row-span-2 p-4">
      <ul class="list">
        <li class="p-4 pb-2 text-xl tracking-wide">Utilisateurs de mon domaine</li>
        <li v-for="user in stats.usersOfMyRealm" :key="user._id" class="list-row">
          <div class="flex items-baseline">
            <span class="font-semibold">{{ user.username }}</span>
          </div>
          <span class="text-xs text-gray-500">{{ user.email }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>