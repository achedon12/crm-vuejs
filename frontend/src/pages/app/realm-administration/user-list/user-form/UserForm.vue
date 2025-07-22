<script setup lang="ts">
import {ref, computed, onMounted, reactive} from "vue";
import {useUserStore} from "@/stores/userStore";
import {useAuthStore} from "@/stores/authStore";
import {UserRole} from "@/utils/interfaces/User";
import {useRoute, useRouter} from "vue-router";
import Request from "@/api/Request";
import Urls from "@/api/Urls";
import {useToast} from "vue-toastification";
import {useI18n} from "vue-i18n";

const route = useRoute();
const {push} = useRouter();
const request = Request();
const userStore = useUserStore();
const authStore = useAuthStore();
const toast = useToast();
const {t} = useI18n();

const isLoading = ref(false);
const editMode = ref(false);

const formData = reactive({
  id: null,
  username: "",
  email: "",
  firstname: "",
  lastname: "",
  role: "",
});

const isEdit = computed(() => !!formData.id);

const fetchUser = async (userId: string) => {
  isLoading.value = true;
  const response = await request.get(Urls.account.get + userId);
  if (response.status === 200) {
    Object.assign(formData, response.data);
    formData.id = userId;
  } else {
    toast.error(t("toast.loadingUnsuccessfully"));
  }
  isLoading.value = false;
};

const saveUser = async () => {
  isLoading.value = true;
  try {
    debugger
    const user = {
      username: formData.username,
      email: formData.email,
      firstname: formData.firstname,
      lastname: formData.lastname,
      role: formData.role as UserRole,
      realm: authStore.realm._id,
    }
    if (isEdit.value) {
      debugger
      await request.put(Urls.account.update + formData.id, user);
      await userStore.updateUser(user);
      await push({name: "realm-administration-home"});
      toast.success(t("toast.updateSuccessfully"));
    } else {
      await request.post(Urls.account.create, user);
      await userStore.addUser(user);
      await push({name: "realm-administration-home"});
      toast.success(t("toast.createSuccessfully"));
    }
    editMode.value = false;
  } catch (e) {
    toast.error(t("error.generic"));
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (route.params.id) {
    await fetchUser(route.params.id as string);
  } else {
    editMode.value = true;
  }
});
</script>

<template>
  <div class="min-h-screen py-8 px-4 border-t border-gray-200">
    <div v-if="isLoading" class="flex justify-center items-center h-32">
      <span>Chargement...</span>
    </div>
    <div v-else class="mx-auto max-w-4xl">
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-primary">
          {{ isEdit ? t("realmAdministration.userManagement.view") : t("realmAdministration.userManagement.create") }}
        </h1>
        <div v-if="isEdit">
          <button v-if="!editMode" @click="editMode = true" class="btn btn-primary">
            {{ t("action.edit") }}
          </button>
          <div v-else class="flex gap-2">
            <button @click="editMode = false" class="btn btn-ghost">
              {{ t("action.cancel") }}
            </button>
            <button @click="saveUser" class="btn btn-primary">
              {{ t("action.save") }}
            </button>
          </div>
        </div>
      </header>

      <form v-if="editMode" @submit.prevent="saveUser" class="fieldset p-8 bg-base-100 shadow-lg rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="label">
            {{ t("form.field.username") }}
          </label>
          <input v-model="formData.username" required class="input"/>

          <label class="label">
            {{ t("form.field.email") }}
          </label>
          <input v-model="formData.email" type="email" required class="input"/>

          <label class="label">
            {{ t("form.field.firstname") }}
          </label>
          <input v-model="formData.firstname" required class="input"/>

          <label class="label">
            {{ t("form.field.lastname") }}
          </label>
          <input v-model="formData.lastname" required class="input"/>

          <label class="label">
            {{ t("form.field.role") }}
          </label>
          <select v-model="formData.role" required class="select">
            <option value="user">
              {{ t("form.field.user") }}
            </option>
            <option value="admin">
              {{ t("form.field.admin") }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary mt-8">
          {{ isEdit ? "Modifier" : "Ajouter" }}
        </button>
      </form>

      <div v-else class="p-8 bg-base-100 shadow-lg rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-semibold">
              {{ t("form.field.username") }} :
            </span>
            <span>{{ formData.username }}</span>
          </div>
          <div>
            <span class="font-semibold">
              {{ t("form.field.email") }} :
            </span>
            <span>{{ formData.email }}</span>
          </div>
          <div>
            <span class="font-semibold">
              {{ t("form.field.firstname") }} :
            </span>
            <span>{{ formData.firstname }}</span>
          </div>
          <div>
            <span class="font-semibold">
              {{ t("form.field.lastname") }} :
            </span>
            <span>{{ formData.lastname }}</span>
          </div>
          <div>
            <span class="font-semibold">
              {{ t("form.field.role") }} :
            </span>
            <span>{{ formData.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}</span>
          </div>
          <div>
            <span class="font-semibold">
              {{ t("form.field.createdAt") }} :
            </span>
            <span>{{ new Date(formData.createdAt).toLocaleDateString() }}</span>
          </div>
          <div>
            <span class="font-semibold">
              {{ t("form.field.updatedAt") }} :
            </span>
            <span>{{ new Date(formData.updatedAt).toLocaleDateString() }}</span>
          </div>
          <div>
            <span class="font-semibold">
              {{ t("form.field.state") }} :
            </span>
            <span>{{ formData.state }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>