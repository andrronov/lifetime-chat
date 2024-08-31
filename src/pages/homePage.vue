<template>
  <div class="flex flex-col bg-indigo-200 justify-center items-center h-screen">
   <h1 class="mb-8 font-semibold text-xl">Выберите профиль:</h1>
    <div class="grid grid-cols-3 gap-8">
      <div v-for="(profile, index) in profiles" :key="index" @click="selectProfile(profile)" class="flex flex-row items-center justify-between gap-8 p-4 border-2 rounded-lg border-gray-800 cursor-pointer hover:bg-indigo-800 hover:text-white hover:scale-110 transition-transform duration-300 ease-in-out">
         <p class="text-lg">{{ profile.name }}</p>
         <img :src="profile.img" class="w-12 h-12" alt="avatar">
      </div>
    </div>
  </div>

  <loadingScreen v-if="loading" />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { profiles } from '../../data/profiles.js'
import { useDataStore } from '../store/index.js'
import loadingScreen from "../components/UI/loadingScreen.vue";

const router = useRouter()
const store = useDataStore()
const loading = ref(false)

function selectProfile(profile){
  if(sessionStorage.getItem('error') == profile.id){
    return router.push('error')
  }
  loading.value = true
   store.userLogin(profile)
   router.push('/chat')
}
</script>

<style></style>
