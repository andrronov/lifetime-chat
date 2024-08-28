<template>
  <wrapperComponent>
   <div class="flex flex-col h-screen justify-between">
      <div v-if="$route.params.id" class="flex flex-row items-center justify-center gap-4 h-[66.5px] border-b-2 border-black bg-white text-black w-full">
         <img :src="profiles[$route.params.id].img" class="w-10 h-10" alt="avatar">
         <p class="text-xl font-medium">{{ profiles[$route.params.id].name }}</p>
         <div class="w-3 h-3 rounded-full " :class="isOnline ? 'bg-green-500' : 'bg-gray-800'"></div>
      </div>

      <div v-if="$route.params.id" class="h-full w-full flex flex-col-reverse overflow-y-auto bg-gradient-to-r from-indigo-300 to-green-300">
         <p v-for="(msg, index) in 12" :key="index"
            class="p-2 my-2 border border-black bg-indigo-700 text-white h-auto mx-px break-words max-w-[210px] xs:max-w-[395px] sm:max-w-2xl"
            :class="index % 2 == 0 ? 'bg-indigo-700 self-start' : 'bg-green-700 self-end'">
            Message wassup niggaaaaaaasadsadsadsafksdkfjejfiefjewoijioewjfoiejosadkslfdmlkdsfklsdlfkskdfkldsfsdfsamdslfdslfkldsfklkldfdsf
         </p>
      </div>

      <div v-if="$route.params.id" class="flex flex-row items-center">
         <input type="text" class="w-full p-1.5 border border-t-black" placeholder="Введите сообщение..." />
         <button class="p-1.5 border border-t-black hover:bg-white">Отправить</button>
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