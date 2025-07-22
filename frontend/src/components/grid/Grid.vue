<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import {FilterMatchMode} from '@primevue/core/api'
import {useI18n} from "vue-i18n";
import {useTaskStore} from "@/stores/taskStore";

interface ColumnDef {
  key: string
  label: string
  sortable?: boolean
  render?: (item: any) => string
  view?: (item: any) => string
}

interface Action {
  label: string
  icon: string
  command: (item: any) => void
  color?: string
}

const props = defineProps<{
  title?: string,
  columns: ColumnDef[]
  actions: Action[]
  loading?: boolean,
  items: any[]
}>()

const {t} = useI18n()

const filters = ref<{ [key: string]: any }>({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS}
})

props.columns.forEach(col => {
  filters.value[col.key] = {value: null, matchMode: FilterMatchMode.CONTAINS}
})
</script>

<template>
  <DataTable
      v-model:filters="filters"
      :value="items"
      :loading="props.loading"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      size="small"
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
        <h3 class="text-xl font-semibold">
          {{ props.title || t('grid.title') }}
        </h3>
        <div class="flex items-center space-x-2">
          <InputText v-model="filters['global'].value" placeholder="Recherche globale..."/>
          <button
              v-if="props.actions.some(action => action.icon === 'add')"
              class="btn btn-primary"
              @click="props.actions.find(action => action.icon === 'add').command()"
          >
            <span class="material-symbols-rounded">add</span>
            {{ props.actions.find(action => action.icon === 'add').label || t('grid.add') }}
          </button>
        </div>
      </div>
    </template>
    <Column
        v-if="props.actions.length > 0"
        key="actions"
        header="Actions"
    >
      <template #body="{ data }">
        <div class="flex space-x-1">
          <button
              v-for="action in props.actions.filter(a => a.icon !== 'add')"
              :key="action.label"
              @click="action.command(data)"
              class="cursor-pointer w-8 h-8"
              :title="action.label"
          >
            <span class="material-symbols-rounded hover:brightness-150 transition-all duration-200"
                  :class="`text-${action.color || 'primary'}`">
                  {{ action.icon }}
            </span>
          </button>
        </div>
      </template>
    </Column>
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