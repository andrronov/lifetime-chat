<template>
  <wrapperComponent>
   <div class="flex flex-col h-screen justify-between">
      <div v-if="$route.params.id" class="flex flex-row items-center justify-center gap-4 h-[66.5px] border-b-2 border-black bg-white dark:bg-indigo-950 dark:text-white text-black w-full">
         <img :src="profiles[$route.params.id].img" class="w-10 h-10" alt="avatar">
         <p class="text-xl font-medium">{{ profiles[$route.params.id].name }}</p>
         <onlineIndicator :is-online="isOnline" />
      </div>

      <!-- <div @scroll="console.log('scrolling ', chatView, 'c height ', chatView.clientHeight, 'c top ', chatView.clientTop, 'ff setTop ', chatView.offsetTop, 'ff setHeith ', chatView.offsetHeigth, 'scr top ', chatView.scrollTop, 'scr top max ', chatView.scrollTopMax, 'scr heith ', chatView.scrollHeight)" v-if="$route.params.id && store.$state.chatMessages" ref="chatView" class="h-full w-full flex flex-col overflow-y-auto bg-gradient-to-r from-indigo-300 to-green-300 dark:bg-gradient-to-r dark:from-indigo-800 dark:to-green-800"> -->
      <div v-if="$route.params.id && store.$state.chatMessages" id="chat" ref="chatView" class="h-full w-full flex flex-col overflow-y-auto bg-gradient-to-r from-indigo-300 to-green-300 dark:bg-gradient-to-r dark:from-indigo-800 dark:to-green-800">
         <!-- <p v-for="(msg, index) in store.$state.chatMessages.filter(chat => chat.chatId == getChatId(store.$state.user.id, route.params.id))" :key="index" -->
         <!-- <p v-for="(msg, index) in store.$state.chatMessages" :key="index" -->
         <p v-for="(msg, index) in chatMessagesComp" :key="index"
            class="p-2 my-2 border border-black text-white h-auto mx-px break-words max-w-[210px] xs:max-w-[395px] sm:max-w-2xl"
            :class="msg.userId === store.$state.user.id ? 'bg-green-700 self-end' : 'bg-indigo-700 self-start'">
            {{ msg.message }}
         </p>
      </div>

      <div v-if="$route.params.id" class="flex flex-row items-center">
         <input @keydown.enter="sendMessage" @input="setTypingIndicator" v-model="input" ref="inputview" type="text" class="w-full p-2 text-black border-t border-black outline-none focus:border-none" placeholder="Введите сообщение..." />
         <button @click="sendMessage" class="p-2 border-t border-black hover:bg-gray-200 dark:hover:bg-gray-800">Отправить</button>
      </div>

      <div v-else class="my-auto self-center">
         <p class="text-xl font-medium">Выберите чат</p>
      </div>
   </div>
  </wrapperComponent>
</template>

<script setup>
import { watchEffect, onMounted, onBeforeUnmount, computed, ref, watch } from 'vue'
import wrapperComponent from '../components/wrapperComponent.vue';
import onlineIndicator from '../components/UI/onlineIndicator.vue'
import { profiles } from '../../data/profiles';
import socket from '../socket/index.js'
import { useDataStore } from '../store';
import { useRoute } from 'vue-router';


const route = useRoute()
const store = useDataStore()
const input = ref('')
const chatView = ref(null)
const inputview = ref(null)

function getChatId(fromUserId, toUserId){
   const idArray = Array.from(arguments)
   const chatId = idArray.sort((a, b) => a - b)
      .reduce((acc, curent) => String(acc) + String(curent))
   return chatId
}

function scrollChat(view){
   view.scrollTop = chatView.value.scrollHeight;
   chatView.value=null
}

function sendMessage(){
   if(input.value.trim().length > 0){
      const chatId = getChatId(store.$state.user.id, route.params.id)
      socket.send(JSON.stringify({
         type: 'msg',
         method: 'sendMessage',
         chatId,
         users: [store.$state.user.id, route.params.id],
         userId: store.$state.user.id,
         input: input.value
      }))
      input.value = ''
   }
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const setTypingIndicator = debounce(() => {
    console.log(input.value);
}, 3500);

onMounted(() => {
   socket.onopen = () => {
      socket.send(JSON.stringify({
         type: 'connection',
         method: 'connection',
         user: JSON.parse(sessionStorage.getItem('userProfile'))
      }))
      socket.send(JSON.stringify({
         type: 'msg',
         method: 'getMessages',
      }))
   }

   socket.onmessage = (msg) => {
      const parsedMessage = JSON.parse(msg.data)
      switch (parsedMessage.method) {
         case 'connection':
            console.log(parsedMessage);
            store.setOnlineUsers(parsedMessage.users)
            break;
         case 'disconnection':
            store.setOnlineUsers(parsedMessage.users)
            break;
         case 'sentMsg':
            console.log(parsedMessage, parsedMessage.chatId);
            store.addMessage(parsedMessage.chatId, {userId: parsedMessage.data.author, message: parsedMessage.data.newMessage})
            break;
         case 'chatMessages':
            console.log(parsedMessage);
            store.setMessages(parsedMessage.msgs)
            break;
      
         default:
            break;
      }
   }
})

const isOnline = computed(() => store.$state.onlineUsers.includes(Number(route.params.id)))
const chatMessagesComp = computed(() => {
   return store.$state.chatMessages[getChatId(store.$state.user.id, route.params.id)]
})

watch(route, () => {
      const chatId = getChatId(store.$state.user.id, route.params.id)
      socket.send(JSON.stringify({
         type: 'msg',
         method: 'getMessages',
         chatId
      }))
})

watchEffect(() => {
   // Chat scrolling
   if(chatView.value) {
         const view = chatView.value
         scrollChat(view)
   }
   // Input focus
   if(inputview.value) inputview.value.focus() 
})

onBeforeUnmount(() => {
   socket.send(JSON.stringify({
      type: 'connection',
      method: 'disconnection',
      user: store.$state.user
   }))
   store.userLogout()
})
</script>