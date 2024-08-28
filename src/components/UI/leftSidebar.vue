<template>
   <div class="flex flex-col h-screen border-r-2 border-black dark:border-white">
      <h1 class="pishi p-1 my-1 text-black break-words dark:text-white text-sm xs:text-xl sm:text-2xl text-center hover:text-gray-800">
         Lifetime chat
      </h1>
      <div class="mt-2 space-y-3 overflow-y-auto">
        <sidebarTab :is-visible="userId !== index" :active="route.path == `/chat/${index}`" :link="`/chat/${index}`" v-for="(profile, index) in profiles" :key="index">
           <template v-slot:icon>
             <img :src="profile.img" class="w-8 h-8 sm:w-10 sm:h-10" alt="avatar">
           </template>
           <template v-slot:name>
             {{ profile.name }}
           </template>
           <div class="w-3 h-3 rounded-full hidden sm:block" :class="store.$state.onlineUsers.includes(index) ? 'bg-green-500' : 'bg-gray-800'"></div>
         </sidebarTab>
       </div>
 
      <div class="flex flex-row items-center justify-center mt-auto mb-5 xs:w-full cursor-pointer hover:bg-gray-800 hover:text-gray-300 dark:hover:bg-gray-400">
 
             <!-- <div v-if="user" @click="toUserProfile" class="flex flex-row w-full">
                 <img :src="user.avatar" class="object-cover w-full h-full sm:w-10 sm:h-10 xl:w-12 xl:h-12">
                 <div class="flex-col ml-2 hidden sm:block">
                     <h1 v-if="user" class="text-sm hidden sm:block font-bold text-gray-300 dark:text-gray-800">
                         {{ user.name }} {{ user.surname }}
                     </h1> 
                     <h1 v-else class="text-sm font-bold text-gray-300 dark:text-gray-800">
                         Undefined
                     </h1> 
                     <p class="text-sm hidden sm:block text-gray-400 dark:text-gray-700">
                         @{{ user.id }}
                     </p>
                 </div>
             </div>
             <UISpinner v-else /> -->
         </div>
    </div>
</template>

<script setup>
import sidebarTab from './sidebar/sidebarTab.vue';
import { useDataStore } from '../../store';
import { useRoute } from 'vue-router';
import { profiles } from '../../../data/profiles';
import { computed } from 'vue';

const store = useDataStore()
const route = useRoute()
const userId = computed(() => {
  const user = JSON.parse(sessionStorage.getItem('userProfile'))
  return user.id
})
</script>