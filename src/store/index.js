import { defineStore } from "pinia";

export const useDataStore = defineStore('data', {
   state: () => ({
      chatMessages: [],
      user: null
   }),

   getters: {},

   actions: {
      userLogin(userData){
         sessionStorage.setItem('userProfile', JSON.stringify(userData)),
         this.user = userData
      }
   }
})