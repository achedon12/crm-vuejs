<script setup lang="ts">

import Grid from "@/components/grid/Grid.vue";
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n"

const {push} = useRouter();
const {t} = useI18n();

const userStore = useUserStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await userStore.fetchUsers();
  loading.value = false;
})

const gridTitle = t('realmAdministration.userManagement.gridTitle', {
  count: userStore.users.length
});

const columns = [
  {key: 'username', label: t('form.field.username'), sortable: true},
  {key: 'email', label: t('form.field.email'), sortable: true},
  {key: 'firstname', label: t('form.field.firstname'), sortable: true},
  {key: 'lastname', label: t('form.field.lastname'), sortable: true},
  {key: 'role', label: t('form.field.role'), sortable: true},
  {key: 'state', label: t('form.field.state'), sortable: true},
  {
    key: 'createdAt',
    label: t('form.field.createdAt'),
    render: (user) => new Date(user.createdAt).toLocaleDateString(),
    sortable: true
  },
  {
    key: 'updatedAt',
    label: t('form.field.updatedAt'),
    render: (user) => new Date(user.updatedAt).toLocaleDateString(),
    sortable: true
  }
];

const actions = [
  {
    label: t('realmAdministration.userManagement.create'),
    icon: 'add',
    command: async () => {
      await push({name: 'user-form', params: {id: null}});
    },
    color: 'primary'
  },
  {
    label: t('realmAdministration.userManagement.view'),
    icon: 'visibility',
    command: async (user) => {
      await push({name: 'user-form', params: {id: user ? user._id : null}});
    },
    color: 'primary'
  },
  {
    label: t('realmAdministration.userManagement.delete'),
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