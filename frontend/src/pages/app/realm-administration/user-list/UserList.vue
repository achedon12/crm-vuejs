<script setup lang="ts">

import Grid from "@/components/grid/Grid.vue";
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore";
import {useRouter} from "vue-router";

const {push} = useRouter();

const userStore = useUserStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await userStore.fetchUsers();
  loading.value = false;
})

const gridTitle = 'Utilisateurs';
const columns = [
  {key: 'username', label: 'Nom d’utilisateur', sortable: true},
  {key: 'email', label: 'Email', sortable: true},
  {key: 'firstname', label: 'Prénom', sortable: true},
  {key: 'lastname', label: 'Nom de famille', sortable: true},
  {key: 'role', label: 'Rôle', sortable: true},
  {key: 'state', label: 'État', sortable: true},
  {
    key: 'createdAt',
    label: 'Date de création',
    render: (user) => new Date(user.createdAt).toLocaleDateString(),
    sortable: true
  },
  {
    key: 'updatedAt',
    label: 'Date de mise à jour',
    render: (user) => new Date(user.updatedAt).toLocaleDateString(),
    sortable: true
  }
];

const actions = [
  {
    label: 'Créer un utilisateur',
    icon: 'add',
    command: async () => {
      await push({name: 'user-form', params: {id: null}});
    },
    color: 'primary'
  },
  {
    label: 'Modifier',
    icon: 'edit',
    command: async (user) => {
      await push({name: 'user-form', params: {id: user ? user._id : null}});
    },
    color: 'primary'
  },
  {
    label: 'Supprimer',
    icon: 'delete',
    command: (user) => {
      // userStore.deleteUser(user);
    },
    color: 'error'
  }
]

</script>

<template>
  <Grid :title="gridTitle" :columns="columns" :loading="loading" :actions="actions" :items="userStore.users"/>
</template>