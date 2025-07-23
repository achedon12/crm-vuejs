<script setup lang="ts">

import Grid from "@/components/grid/Grid.vue";
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n"
import Swal from "sweetalert2";
import Request from "@/api/Request";
import Urls from "@/api/Urls";

const {push} = useRouter();
const {t} = useI18n();
const request = Request();

const userStore = useUserStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await userStore.fetchUsers();
  loading.value = false;
})

const gridTitle = t('realmAdministration.userManagement.gridTitle', {
  count: userStore?.users?.length
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
      if (user && user._id) {
        deleteUser(user._id);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('realmAdministration.userManagement.deleteErrorTitle'),
          text: t('realmAdministration.userManagement.deleteErrorText')
        });
      }
    },
    color: 'error'
  }
];

const deleteUser = async (userId) => {
  const result = await Swal.fire({
    title: t('realmAdministration.userManagement.deleteConfirmTitle'),
    text: t('realmAdministration.userManagement.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  });
  if (result.isConfirmed) {
    loading.value = true;
    try {
      await request.del(Urls.account.delete + userId);
      await userStore.removeUser(userId);
      Swal.fire({
        icon: 'success',
        title: t('realmAdministration.userManagement.deleteSuccessTitle'),
        text: t('realmAdministration.userManagement.deleteSuccessText')
      });
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: t('realmAdministration.userManagement.deleteErrorTitle'),
        text: t('realmAdministration.userManagement.deleteErrorText')
      });
    } finally {
      loading.value = false;
    }
  }
};

</script>

<template>
  <Grid :title="gridTitle" :columns="columns" :loading="loading" :actions="actions" :items="userStore.users"/>
</template>