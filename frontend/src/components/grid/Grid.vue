<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'

interface ColumnDef {
  key: string
  label: string
  sortable?: boolean
  render?: (item: any) => string
  view?: (item: any) => string
}

const props = defineProps<{
  columns: ColumnDef[]
  fetchData: () => Promise<any[]>
}>()

const items = ref<any[]>([])
const loading = ref(true)

const filters = ref<{ [key: string]: any }>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

onMounted(async () => {
  loading.value = true
  items.value = await props.fetchData()
  loading.value = false
})

props.columns.forEach(col => {
  filters.value[col.key] = { value: null, matchMode: FilterMatchMode.CONTAINS }
})
</script>

<template>
  <DataTable
      v-model:filters="filters"
      :value="items"
      :loading="loading"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :size="small"
      :globalFilterFields="props.columns.map(col => col.key)"
      paginator
      removableSort
      stripedRows
      filterDisplay="row"
      responsiveLayout="scroll"
      tableStyle="width: 100%; height: 100%;"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold">Tâches</h3>
        <InputText v-model="filters['global'].value" placeholder="Recherche globale..." />
      </div>
    </template>
    <Column
        v-for="col in props.columns"
        :key="col.key"
        :field="col.key"
        :header="col.label"
        :filter="true"
        :showFilterMenu="false"
        :sortable="col.sortable !== false"
    >
      <template #body="{ data }">
        <span v-if="col.view" :class="col.view(data)">
          {{ col.render ? col.render(data) : data[col.key] }}
        </span>
        <span v-else>
          {{ col.render ? col.render(data) : data[col.key] }}
        </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Filtrer..."
            style="width: 100%"
        />
      </template>
    </Column>
    <template #empty>
      <span>Aucune donnée</span>
    </template>
    <template #loading>
      <span>Chargement des données...</span>
    </template>
  </DataTable>
</template>