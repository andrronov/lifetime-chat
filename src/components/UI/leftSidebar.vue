<template>
   <div class="flex flex-col h-screen border-r-2 bg-red-500/0 border-black dark:border-gray-500">
      <h1 class="pishi p-1 my-1 text-black break-words dark:text-white text-sm xs:text-xl sm:text-2xl text-center hover:text-gray-800">
         Lifetime chat
      </h1>
      <div class="mt-2 space-y-3 overflow-y-auto">
        <sidebarTab :is-visible="user.id !== index" :active="route.path == `/chat/${index}`" :link="`/chat/${index}`" v-for="(profile, index) in profiles" :key="index">
           <template v-slot:icon>
             <img :src="profile.img" class="w-8 h-8 sm:w-10 sm:h-10" alt="avatar">
           </template>
           <template v-slot:name>
             {{ profile.name }}
           </template>
           <onlineIndicator class="hidden sm:block" :is-online="store.$state.onlineUsers.includes(index)" />
         </sidebarTab>
         
        <sidebarTab @click="$emit('openModal')" :is-visible="true" :active="false" :link="`/chat`">
           <template v-slot:icon>
             <img src="/icons/settings.svg" class="w-8 h-8 sm:w-10 sm:h-10" alt="icon">
           </template>
           <template v-slot:name>
             Настройки
           </template>
           <p></p>
         </sidebarTab>
        <sidebarTab @click="$emit('exit')" :is-visible="true" :active="false" :link="`/chat`">
           <template v-slot:icon>
             <img src="/icons/exit.svg" class="w-8 h-8 sm:w-10 sm:h-10" alt="icon">
           </template>
           <template v-slot:name>
             Выход
           </template>
           <p></p>
         </sidebarTab>
       </div>
 
      <div class="flex flex-row items-center justify-center mt-auto mb-5 xs:w-full dark:hover:bg-gray-800 dark:hover:text-gray-300 hover:bg-gray-400">
 
             <div v-if="user" class="flex flex-row w-full border-y-2 border-black dark:border-white py-2">
                 <img :src="user.img" class="object-cover w-full h-full sm:w-10 sm:h-10 xl:w-12 xl:h-12">
                 <div class="flex-col ml-2 hidden sm:block">
                     <h1 v-if="user" class="text-sm hidden sm:block font-bold dark:text-gray-300 text-gray-800">
                         {{ user.name }}
                     </h1> 
                     <h1 v-else class="text-sm font-bold dark:text-gray-300 text-gray-800">
                         Undefined
                     </h1> 
                     <p class="text-sm hidden sm:block dark:text-gray-400 text-gray-700">
                         id: {{ user.id }}
                     </p>
                 </div>
                </div>

             <!-- <UISpinner v-else /> -->
         </div>
    </div>
</template>

<script setup>
import sidebarTab from './sidebar/sidebarTab.vue';
import onlineIndicator from './onlineIndicator.vue';
import { useDataStore } from '../../store';
import { useRoute } from 'vue-router';
import { profiles } from '../../../data/profiles';
import { computed } from 'vue';

const store = useDataStore()
const route = useRoute()
const user = computed(() => {
  return JSON.parse(sessionStorage.getItem('userProfile'))
})
</script>