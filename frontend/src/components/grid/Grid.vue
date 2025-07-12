<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface Column {
  key: string;
  label: string;
}

const props = defineProps<{
  columns: Column[];
  fetchData: () => Promise<any[]>;
}>();

const items = ref<any[]>([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    items.value = await props.fetchData();
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
watch(() => props.fetchData, loadData);
</script>

<template>
  <div class="overflow-x-auto h-full">
    <table class="table table-zebra">
      <thead>
      <tr>
        <th v-for="col in props.columns" :key="col.key">{{ col.label }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="loading">
        <td :colspan="props.columns.length">Chargement...</td>
      </tr>
      <tr v-for="item in items" :key="item._id">
        <td v-for="col in props.columns" :key="col.key">{{ item[col.key] }}</td>
      </tr>
      <tr v-if="!loading && items.length === 0">
        <td :colspan="props.columns.length">Aucune donnée</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>