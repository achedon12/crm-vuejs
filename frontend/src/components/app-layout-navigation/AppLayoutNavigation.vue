<template>
  <div class="flex gap-2 items-center">
    <button
        class="btn btn-ghost btn-circle"
        :class="{ 'x-flip': !isSidebarMinimized }"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle sidebar"
    >
      <span class="material-icons text-secondary">menu_open</span>
    </button>
    <nav class="flex items-center">
      <ol class="flex items-center space-x-2 text-sm">
        <li v-for="item in items" :key="item.label" class="flex items-center">
          <span class="mx-1 text-base-content/40">/</span>
          <router-link
              v-if="!item.hasChildren"
              :to="item.to"
              class="link link-hover"
              @click.prevent="handleBreadcrumbClick(item)"
          >
            {{ item.label }}
          </router-link>
          <span v-else class="text-base-content/60">{{ item.label }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'

const props = defineProps<{
  isSidebarMinimized: boolean,
  navigationRoutes: { routes: any[] }
}>()
const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()
const {t} = useI18n()

const findRouteName = (name: string) => {
  const traverse = (routers: any[]) => {
    for (const router of routers) {
      if (router.name === name) {
        return router.displayName
      }
      if (router.children) {
        const result = traverse(router.children)
        if (result) {
          return result
        }
      }
    }
    return ''
  }
  return traverse(props.navigationRoutes.routes)
}

const items = computed(() => {
  const result: any[] = []
  route.matched.forEach((route) => {
    const labelKey = findRouteName(route.name)
    if (!labelKey) return
    result.push({
      label: t(labelKey),
      to: route.path,
      hasChildren: route.children && route.children.length > 0,
    })
  })
  return result
})

const handleBreadcrumbClick = (item: any) => {
  if (!item.hasChildren) {
    router.push(item.to)
  }
}
</script>

<style scoped>
.x-flip {
  transform: scaleX(-1);
}
</style>