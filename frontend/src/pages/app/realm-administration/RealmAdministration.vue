<script setup lang="ts">
import UserList from "@/pages/app/realm-administration/user-list/UserList.vue";
import {useI18n} from "vue-i18n"

const {t} = useI18n();
</script>

<template>
  <div class="tabs tabs-lift h-full">
    <input type="radio" name="my_tabs" class="tab font-bold" :aria-label="t('realmAdministration.userManagement.title')" checked="checked"/>
    <div class="tab-content bg-base-100 border-base-300 p-6">
      <UserList />
    </div>

    <input type="radio" name="my_tabs" class="tab font-bold" :aria-label="t('realmAdministration.roleManagement.title')"/>
    <div class="tab-content bg-base-100 border-base-300 p-6">
    </div>
  </div>
</template>