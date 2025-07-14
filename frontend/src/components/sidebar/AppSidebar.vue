<template>
  <aside
      :class="[
        'transition-all duration-300 bg-base-200 flex flex-col justify-between overflow-y-auto min-h-screen p-4',
        props.mobile ? 'w-screen fixed z-40 h-full' : 'w-72 h-full',
        !writableVisible ? 'hidden' : '',
      ]"
  >
    <nav>
      <ul>
        <li class="mb-4">
          <div class="flex items items-center px-4 py-3 bg-base-300 rounded">
            <UserAvatar
                size="small"
            />
            <span
                :class="`${usernameClass.value} font-semibold ml-4 truncate`"
                style="max-width: 12rem; display: inline-block;"
                :title="username"
            >
            {{ truncatedUsername }}
          </span>
          </div>
        </li>
        <li v-for="(route, index) in filteredRoutes" :key="index">
          <div
              class="flex items-center cursor-pointer px-4 py-3 hover:bg-base-300 rounded"
              :aria-label="`${!route.hideChildren && route.children ? 'Ouvrir la catégorie ' : 'Aller à'} ${t(route.displayName)}`"
              @click="handleRouteClick(route, index)"
              :class="{
                'font-semibold text-primary': routeHasActiveChild(route),
                'justify-between': !route.hideChildren && route.children,
              }"
          >
              <span class="flex items-center gap-2">
                <span v-if="route.meta && route.meta.icon" class="material-symbols-rounded text-lg" :class="iconColor(route)">
                  {{ route.meta.icon }}
                </span>
                {{ t(route.displayName) }}
              </span>
            <span v-if="!route.hideChildren && route.children" class="material-symbols-rounded">
                {{ expanded[index] ? 'expand_less' : 'expand_more' }}
              </span>
          </div>
          <ul v-if="!route.hideChildren && route.children && expanded[index]" class="pl-6">
            <li
                v-for="(childRoute, index2) in route.children"
                :key="index2"
                class="py-2 cursor-pointer rounded hover:bg-base-300"
                :class="{
                  'font-semibold text-primary': isActiveChildRoute(childRoute),
                }"
                @click="goToRoute(childRoute.name)"
            >
                <span v-if="childRoute.meta && childRoute.meta.icon" class="material-symbols-rounded text-base mr-2"
                      :class="iconColor(childRoute)">
                  {{ childRoute.meta.icon }}
                </span>
              {{ t(childRoute.displayName) }}
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <button
        class="btn btn-ghost w-full text-left"
        @click="logout"
        aria-label="Logout"
    >
      <span class="material-symbols-rounded text-lg text-secondary">logout</span>{{ t('menu.logout') }}
    </button>
  </aside>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useAuthStore} from "@/stores/authStore";
import {useToast} from "vue-toastification";
import UserAvatar from "@/components/user/UserAvatar.vue";

const toast = useToast()

const authStore = useAuthStore()
const props = defineProps({
  navigationRoutes: {type: Object, required: true},
  visible: {type: Boolean, default: true},
  mobile: {type: Boolean, default: false},
})
const emit = defineEmits(['update:visible'])

const writableVisible = computed({
  get: () => props.visible,
  set: (v) => emit('update:visible', v),
})

const route = useRoute()
const router = useRouter()
const {t} = useI18n()

const expanded = ref<boolean[]>([])

const isActiveChildRoute = (child) => route.name === child.name

const routeHasActiveChild = (section) => {
  if (!section.children) {
    return route.name === section.name
  }
  return route.name === section.name || section.children.some(({name}) => route.name === name)
}

const setActiveExpand = () => {
  expanded.value = props.navigationRoutes.routes.map((route) => routeHasActiveChild(route))
}

const logout = () => {
  let redirectName = 'login'
  if (authStore.superAdmin && authStore.isSwitched) {
    redirectName = 'admin'
  }
  authStore.logout();
  toast.error('Déconnexion réussie')
  router.push({name: redirectName})
}

watch(
    () => route.fullPath,
    () => {
      setActiveExpand()
    },
    {immediate: true},
)

const toggleAccordion = (index: number) => {
  expanded.value[index] = !expanded.value[index]
}

const goToRoute = (name: string) => {
  router.push({name})
}

const handleRouteClick = (route, index) => {
  if (!route.hideChildren && route.children) {
    toggleAccordion(index)
  } else {
    goToRoute(route.name)
  }
}

const iconColor = (route) => routeHasActiveChild(route) ? 'text-primary' : 'text-secondary'

const popoverBody = computed(() =>
    t('cd.poweredBy.body')
        .split(', ')
        .join(',<br>')
        .split('and')
        .join('<br>and')
        .split('  ')
        .join('<br>')
)

const username = computed(() =>
    authStore.user?.username || authStore.superAdmin?.username || t('menu.welcome')
)

const usernameClass = computed(() => {
  const len = username.value.length
  if (len > 20) return 'text-base'
  if (len > 12) return 'text-lg'
  return 'text-xl'
})

const truncatedUsername = computed(() => {
  const maxLen = 24
  return username.value.length > maxLen
      ? username.value.slice(0, maxLen) + '...'
      : username.value
})

const filteredRoutes = computed(() => {
  return props.navigationRoutes.routes.filter(route => {
    if (route.meta?.requiresAdmin) {
      return authStore.user?.role?.includes('admin')
    }
    return true
  })
})
</script>

<style scoped>
.material-symbols-rounded {
  vertical-align: middle;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>