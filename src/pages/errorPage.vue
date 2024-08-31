<template>
  <div class="flex flex-col bg-red-200 justify-center items-center h-screen">
    <h1 v-if="!isUserError" class="mb-8 font-semibold text-xl">Ошибка 404: Страница не найдена</h1>
    <h1 v-else class="mb-8 font-semibold text-xl">Ошибка 405: Данный пользователь уже занят</h1>
    <router-link to="/">
       <button class="p-1.5 border-2 rounded-lg text-xl hover:bg-gray-300 border-black">В меню</button>
    </router-link>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import { useDataStore } from '../store';
const store = useDataStore()
const isUserError = computed(() => sessionStorage.getItem('error'))
onMounted(() => {
  if(isUserError.value) store.userLogout()
})
</script>