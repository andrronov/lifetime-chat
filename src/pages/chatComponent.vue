<template>
  <wrapperComponent>
   <div class="flex flex-col h-screen justify-between">
      <div v-if="$route.params.id" class="flex flex-row items-center justify-center gap-4 h-[57.5px] border-b-2 border-black bg-white text-black w-full">
         <img :src="profiles[$route.params.id].img" class="w-10 h-10" alt="avatar">
         <p class="text-xl font-medium">{{ profiles[$route.params.id].name }}</p>
      </div>

      <div v-if="$route.params.id" class="flex flex-row items-center">
         <input type="text" class="w-full p-1.5 border border-t-black" placeholder="Введите сообщение..." />
         <button class="p-1.5 border border-t-black hover:bg-white">Отправить</button>
      </div>
   </div>
  </wrapperComponent>
</template>

<script setup>
import { watchEffect, onMounted, onBeforeUnmount } from 'vue'
import wrapperComponent from '../components/wrapperComponent.vue';
import { profiles } from '../../data/profiles';
import socket from '../socket/index.js'
import { useDataStore } from '../store';

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
            break;
         case 'disconnection':
            store.setOnlineUsers(parsedMessage.users)
            break;
      
         default:
            break;
      }
   }
})


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