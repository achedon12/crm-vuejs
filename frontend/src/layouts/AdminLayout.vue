<script setup lang="ts">
import {ref} from 'vue'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import AppLayoutNavigation from '@/components/app-layout-navigation/AppLayoutNavigation.vue'
import AdminNavigationRoutes from '@/components/sidebar/AdminNavigationRoutes'

const isSidebarMinimized = ref(false)
const isMobile = ref(false)

</script>

<template>
  <div class="flex min-h-screen">
    <AppSidebar
        class="w-72 h-full"
        :navigationRoutes="AdminNavigationRoutes"
        :visible="!isSidebarMinimized"
        :mobile="isMobile"
    />
    <div class="flex-1 flex flex-col overflow-y-auto h-screen">
      <AppLayoutNavigation
          class="p-4 h-full"
          :navigationRoutes="AdminNavigationRoutes"
          :isSidebarMinimized="isSidebarMinimized"
          @toggle-sidebar="isSidebarMinimized = !isSidebarMinimized"
      />
      <main class="p-4 flex-1">
        <RouterView/>
      </main>
    </div>
  </div>
</template>