<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="card w-full max-w-md shadow-xl bg-base-100">
      <div class="card-body">
        <div class="flex items-center justify-center mb-6">

          <template v-for="n in 3" :key="n">
            <div class="flex flex-col items-center">
              <div
                  :class="[
                  'w-10 h-10 flex items-center justify-center rounded-full border-2',
                  step >= n ? 'bg-primary text-white border-primary' : 'bg-base-200 text-base-content border-base-300'
                ]"
              >
                <template v-if="n === 1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.607 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </template>
                <template v-else-if="n === 2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c1.657 0 3-1.343 3-3V7a3 3 0 10-6 0v1c0 1.657 1.343 3 3 3zm6 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5"/>
                  </svg>
                </template>
                <template v-else>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </template>
              </div>
              <span class="mt-1 text-xs" :class="step === n ? 'font-bold text-primary' : 'text-base-content'">
                {{ n === 1 ? "Infos" : n === 2 ? "Mot de passe" : "Confirmer" }}
              </span>
            </div>
            <div v-if="n < 3" class="w-8 h-1 bg-base-300 mx-2 rounded"></div>
          </template>
        </div>

        <h2 class="card-title justify-center mb-4">Créer un compte</h2>

        <form @submit.prevent="register">
          <div v-if="step === 1">
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Nom d'utilisateur</span>
              </label>
              <input v-model="username" type="text" class="input input-bordered" required />
            </div>
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input v-model="email" type="email" class="input input-bordered" required />
            </div>
          </div>

          <div v-if="step === 2">
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Mot de passe</span>
              </label>
              <input v-model="password" type="password" class="input input-bordered" required />
            </div>
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Confirmer le mot de passe</span>
              </label>
              <input v-model="confirmPassword" type="password" class="input input-bordered" required />
            </div>
          </div>

          <div v-if="step === 3">
            <div class="mb-4">
              <p><b>Nom d'utilisateur :</b> {{ username }}</p>
              <p><b>Email :</b> {{ email }}</p>
            </div>
            <div class="form-control mb-4">
              <label class="cursor-pointer label">
                <input type="checkbox" v-model="acceptTerms" class="checkbox checkbox-primary" required />
                <span class="label-text ml-2">J'accepte les conditions d'utilisation</span>
              </label>
            </div>
          </div>

          <div class="flex justify-between mt-4">
            <button v-if="step > 1" type="button" class="btn btn-outline" @click="prevStep">Précédent</button>
            <button
              v-if="step < 3"
              type="button"
              class="btn btn-primary ml-auto"
              @click="nextStep"
              :disabled="!canGoNext"
            >
              Suivant
            </button>
            <button
              v-if="step === 3"
              class="btn btn-primary ml-auto"
              type="submit"
              :disabled="loading || !acceptTerms"
            >
              <span v-if="loading" class="loading loading-spinner"></span>
              <span v-else>S'inscrire</span>
            </button>
          </div>
        </form>
        <div class="text-center mt-4">
          <RouterLink to="/auth/login" class="link link-primary">Déjà un compte ? Se connecter</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const step = ref(1)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const canGoNext = computed(() => {
  if (step.value === 1) {
    return username.value.length > 2 && email.value.includes('@')
  }
  if (step.value === 2) {
    return password.value.length >= 6 && password.value === confirmPassword.value
  }
  return true
})

function nextStep() {
  if (step.value < 3 && canGoNext.value) step.value++
}
function prevStep() {
  if (step.value > 1) step.value--
}

const register  = async () => {
  loading.value = true
  setTimeout(async () => {
    // Simule une inscription réussie
    authStore.setUser({ id: 2, username: username.value, email: email.value })
    authStore.setToken('fake-jwt-token')
    loading.value = false
    router.push('/')
  }, 1000)
}
</script>