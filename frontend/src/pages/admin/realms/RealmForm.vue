<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue'

const props = defineProps<{
  realm: any | null
}>()
const emit = defineEmits(['save', 'cancel', 'delete'])

const form = ref({
  name: '',
  description: '',
  image: ''
})

watch(() => props.realm, (newRealm) => {
  if (newRealm) {
    form.value = {
      name: newRealm.name,
      description: newRealm.description,
      image: newRealm.image || ''
    }
  } else {
    form.value = {name: '', description: '', image: ''}
  }
}, {immediate: true})

async function handleSubmit() {
  if (props.realm) {
    await emit('save', {...form.value, id: props.realm._id})
  } else {
    await emit('save', {...form.value})
  }
}

function handleCancel() {
  emit('cancel')
}

function handleDelete() {
  if (props.realm) {
    emit('delete', props.realm._id)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h3 class="text-lg font-bold mb-4">
      {{ props.realm ? realm.name : 'Ajouter un realm' }}
    </h3>
    <div>
      <label class="block mb-1">Nom</label>
      <input v-model="form.name" class="input input-bordered w-full" required/>
    </div>
    <div>
      <label class="block mb-1">Description</label>
      <textarea v-model="form.description" class="textarea textarea-bordered w-full" required/>
    </div>
    <div>
      <label class="block mb-1">Image (URL)</label>
      <input v-model="form.image" class="input input-bordered w-full"/>
    </div>

    <div class="flex justify-between items-center mt-4">
      <div class="flex gap-2">
        <button type="submit" class="btn btn-primary">
          {{ props.realm ? 'Enregistrer' : 'Ajouter' }}
        </button>
        <button type="button" class="btn btn-ghost" @click="handleCancel">Annuler</button>
      </div>
      <button v-if="props.realm" type="button" class="btn btn-error ml-2" @click="handleDelete">
        Supprimer
      </button>
    </div>
  </form>
</template>