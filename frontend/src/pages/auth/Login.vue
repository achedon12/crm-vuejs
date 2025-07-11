<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="card w-full max-w-md shadow-xl bg-base-100">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">Connexion</h2>
        <form @submit.prevent="login">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Email ou nom d'utilisateur</span>
            </label>
            <input
              v-model="emailOrUsername"
              type="text"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Mot de passe</span>
            </label>
            <input
              v-model="password"
              type="password"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control mb-4">
            <label class="cursor-pointer label">
              <input type="checkbox" v-model="keepLoggedIn" class="checkbox checkbox-primary" />
              <span class="label-text ml-2">Rester connecté</span>
            </label>
          </div>
          <div class="form-control">
            <button class="btn btn-primary w-full" type="submit" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner"></span>
              <span v-else>Se connecter</span>
            </button>
          </div>
        </form>
        <div class="text-center mt-4">
          <RouterLink to="/auth/register" class="link link-primary">Créer un compte</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

import Request from '@/api/Request.js'
import Urls from "@/api/Urls";
import { useToast } from "vue-toastification"

const emailOrUsername = ref('')
const password = ref('')
const keepLoggedIn = ref(false)
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const request = Request()

const login = async () => {
  loading.value = true
  setTimeout(async () => {
    const response = await request.post(Urls.auth.login, {
      emailOrUsername: emailOrUsername.value,
      password: password.value,
    })

    if (!response.user) {
      loading.value = false
      toast.error(response.message || 'Erreur lors de la connexion')
      return
    }

    toast.success('Connexion réussie')

    // Simule une connexion réussie
    authStore.setUser(response.user)
    authStore.setToken(response.token)
    authStore.setKeepLoggedIn(keepLoggedIn.value)
    authStore.setIsSuperAdmin(response.user.is_super_admin || false)
    loading.value = false
    await router.push({ name: 'dashboard' })
  }, 1000)
}
</script>