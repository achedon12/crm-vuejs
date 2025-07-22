<script setup lang="ts">
import {ref, watch, computed, onMounted} from "vue";
import {useUserStore} from "@/stores/userStore";
import {UserRole} from "@/utils/interfaces/User";
import {useRoute} from "vue-router";
import Request from "@/api/Request";
import Urls from "@/api/Urls";

const route = useRoute()
const request = Request()

const props = defineProps<{
  user?: {
    id?: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
  } | null
}>();

const emit = defineEmits(["saved", "cancel"]);

const userStore = useUserStore();

const form = ref({
  username: "",
  email: "",
  firstname: "",
  lastname: "",
  role: ""
});

watch(() => props.user, (val) => {
  if (val) {
    form.value = {...val};
  } else {
    form.value = {username: "", email: "", firstname: "", lastname: "", role: ""};
  }
}, {immediate: true});

const isEdit = computed(() => !!props.user);

const submit = async () => {
  if (isEdit.value) {
  } else {
  }
  emit("saved");
};

onMounted(async () => {
  if (route.params.id) {
    const userId = route.params.id as string;
    const response = await request.get(Urls.account.get + userId);
    if (response.status === 200) {
      form.value = response.data;
    } else {
      console.error("Failed to fetch user data");
    }
  }
});

</script>

<template>
  <h1 class="text-2xl font-bold mb-4 text-primary">
    {{ isEdit ? "Modifier l'utilisateur" : "Ajouter un utilisateur" }}
  </h1>
  <form @submit.prevent="submit" class="fieldset p-8 bg-base-100 shadow-lg rounded-lg">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="label">Nom d’utilisateur</label>
      <input v-model="form.username" required class="input"/>

      <label class="label">Email</label>
      <input v-model="form.email" type="email" required class="input"/>


      <label class="label">Prénom</label>
      <input v-model="form.firstname" required class="input"/>

      <label class="label">Nom de famille</label>
      <input v-model="form.lastname" required class="input"/>

      <label class="label">Rôle</label>
      <select v-model="form.role" required class="select">
        <option value="user">Utilisateur</option>
        <option value="admin">Administrateur</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary mt-8">{{ isEdit ? "Modifier" : "Ajouter" }}</button>
    <button type="button" @click="$emit('cancel')" class="btn btn-ghost">Annuler</button>
  </form>
</template>