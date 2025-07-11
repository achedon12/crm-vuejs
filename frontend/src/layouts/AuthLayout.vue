<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

const isLgUp = ref(window.innerWidth >= 1024)

const handleResize = () => {
  isLgUp.value = window.innerWidth >= 1024
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="h-screen bg-[var(--va-background-secondary)]">
    <div v-if="isLgUp" class="flex h-full">
      <div class="bg-[#154ec1] h-full flex items-center justify-center" style="width: 35vw">
        <img src="/banner.png" alt="banner" class="mb-2 w-96"/>
      </div>
      <main class="h-full flex items-center justify-center mx-auto max-w-[420px] flex-1"
            style="display: flex !important">
        <RouterView/>
      </main>
    </div>
    <div v-else class="h-full flex flex-col bg-[var(--va-background-secondary)]">
      <div class="p-4 flex-1">
        <main class="h-full flex flex-row items-center justify-start mx-auto max-w-[420px]"
              style="display: flex !important">
          <div class="flex flex-col items-start">
            <RouterLink class="py-4" to="/" aria-label="Visit homepage">
              <img src="/banner.png" alt="banner" class="mb-2"/>
            </RouterLink>
            <RouterView/>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>