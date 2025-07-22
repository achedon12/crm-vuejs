<script setup lang="ts">
import {ref, computed, onMounted, reactive} from "vue";
import {useUserStore} from "@/stores/userStore";
import {useAuthStore} from "@/stores/authStore";
import {UserRole} from "@/utils/interfaces/User";
import {useRoute, useRouter} from "vue-router";
import Request from "@/api/Request";
import Urls from "@/api/Urls";
import {useToast} from "vue-toastification";

const route = useRoute();
const {push} = useRouter();
const request = Request();
const userStore = useUserStore();
const authStore = useAuthStore();
const toast = useToast();

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
    toast.error("Impossible de charger l'utilisateur");
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
      toast.success("Utilisateur modifié avec succès");
    } else {
      await request.post(Urls.account.create, user);
      await userStore.addUser(user);
      await push({name: "realm-administration-home"});
      toast.success("Utilisateur créé avec succès");
    }
    editMode.value = false;
  } catch (e) {
    toast.error("Erreur lors de l'enregistrement");
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
          {{ isEdit ? "Détail utilisateur" : "Ajouter un utilisateur" }}
        </h1>
        <div v-if="isEdit">
          <button v-if="!editMode" @click="editMode = true" class="btn btn-primary">
            Modifier
          </button>
          <div v-else class="flex gap-2">
            <button @click="editMode = false" class="btn btn-ghost">Annuler</button>
            <button @click="saveUser" class="btn btn-primary">Enregistrer</button>
          </div>
        </div>
      </header>

      <form v-if="editMode" @submit.prevent="saveUser" class="fieldset p-8 bg-base-100 shadow-lg rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="label">Nom d’utilisateur</label>
          <input v-model="formData.username" required class="input"/>

          <label class="label">Email</label>
          <input v-model="formData.email" type="email" required class="input"/>

          <label class="label">Prénom</label>
          <input v-model="formData.firstname" required class="input"/>

          <label class="label">Nom de famille</label>
          <input v-model="formData.lastname" required class="input"/>

          <label class="label">Rôle</label>
          <select v-model="formData.role" required class="select">
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary mt-8">
          {{ isEdit ? "Modifier" : "Ajouter" }}
        </button>
      </form>

      <div v-else class="p-8 bg-base-100 shadow-lg rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-semibold">Nom d’utilisateur : </span>
            <span>{{ formData.username }}</span>
          </div>
          <div>
            <span class="font-semibold">Email : </span>
            <span>{{ formData.email }}</span>
          </div>
          <div>
            <span class="font-semibold">Prénom : </span>
            <span>{{ formData.firstname }}</span>
          </div>
          <div>
            <span class="font-semibold">Nom de famille : </span>
            <span>{{ formData.lastname }}</span>
          </div>
          <div>
            <span class="font-semibold">Rôle : </span>
            <span>{{ formData.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>