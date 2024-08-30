import { defineStore } from "pinia";

export const useDataStore = defineStore('data', {
   state: () => ({
      chatMessages: {},
      onlineUsers: [],
      user: JSON.parse(sessionStorage.getItem('userProfile')) || null
   }),

   getters: {},

   actions: {
      setOnlineUsers(arr){
         this.onlineUsers = arr
      },
      userLogin(userData){
         sessionStorage.setItem('userProfile', JSON.stringify(userData)),
         this.user = userData
      },
      userLogout(){
         sessionStorage.removeItem('userProfile')
         this.user = null
      },
      setMessages(messages){
         this.chatMessages = messages
      },
      addMessage(chatId, message){
         if(!this.chatMessages[chatId]){
            this.chatMessages[chatId] = [message]
         } else {
            console.log(this.chatMessages[chatId], this.chatMessages);
            this.chatMessages[chatId].push(message)
         }
      }
   }
})