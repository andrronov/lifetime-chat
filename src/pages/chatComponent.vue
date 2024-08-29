<template>
  <wrapperComponent>
   <div class="flex flex-col h-screen justify-between">
      <div v-if="$route.params.id" class="flex flex-row items-center justify-center gap-4 h-[66.5px] border-b-2 border-black bg-white dark:bg-indigo-950 dark:text-white text-black w-full">
         <img :src="profiles[$route.params.id].img" class="w-10 h-10" alt="avatar">
         <p class="text-xl font-medium">{{ profiles[$route.params.id].name }}</p>
         <onlineIndicator :is-online="isOnline" />
      </div>

      <div v-if="$route.params.id" class="h-full w-full flex flex-col-reverse overflow-y-auto bg-gradient-to-r from-indigo-300 to-green-300 dark:bg-gradient-to-r dark:from-indigo-800 dark:to-green-800">
         <p v-for="(msg, index) in 12" :key="index"
            class="p-2 my-2 border border-black text-white h-auto mx-px break-words max-w-[210px] xs:max-w-[395px] sm:max-w-2xl"
            :class="index % 2 == 0 ? 'bg-green-700 self-start' : 'bg-indigo-700 self-end'">
            Message {{ msg }}
         </p>
      </div>

      <div v-if="$route.params.id" class="flex flex-row items-center">
         <input type="text" class="w-full p-2 text-black border-t border-black outline-none focus:border-none" placeholder="Введите сообщение..." />
         <button class="p-2 border-t border-black hover:bg-gray-200 dark:hover:bg-gray-800">Отправить</button>
      </div>

      <div v-else class="my-auto self-center">
         <p class="text-xl font-medium">Выберите чат</p>
      </div>
   </div>
  </wrapperComponent>
</template>

<script setup>
import { watchEffect, onMounted, onBeforeUnmount, computed, ref } from 'vue'
import wrapperComponent from '../components/wrapperComponent.vue';
import onlineIndicator from '../components/UI/onlineIndicator.vue'
import { profiles } from '../../data/profiles';
import socket from '../socket/index.js'
import { useDataStore } from '../store';
import { useRoute } from 'vue-router';

const route = useRoute()
const store = useDataStore()

onMounted(() => {
   socket.onopen = () => {
      console.log('opened', socket.readyState, socket.OPEN);
      socket.send(JSON.stringify({
         method: 'connection',
         user: JSON.parse(sessionStorage.getItem('userProfile'))
      }))
   }

   socket.onmessage = (msg) => {
      const parsedMessage = JSON.parse(msg.data)

      switch (parsedMessage.method) {
         case 'connection':
            store.setOnlineUsers(parsedMessage.users)
            console.log('User ', parsedMessage.user.name, ' connected');
            console.log(store.$state.onlineUsers);
            break;
         case 'disconnection':
            store.setOnlineUsers(parsedMessage.users)
            break;
      
         default:
            break;
      }
   }
})

const isOnline = computed(() => store.$state.onlineUsers.includes(Number(route.params.id)))
console.log(isOnline.value);

onBeforeUnmount(() => {
   socket.send(JSON.stringify({
      method: 'disconnection',
      user: store.$state.user
   }))
   store.userLogout()
})
</script>

<style>

</style>