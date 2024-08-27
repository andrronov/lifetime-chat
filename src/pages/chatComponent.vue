<template>
  <wrapperComponent>
   <div class="flex flex-col h-screen justify-between">
      <div class="flex flex-row items-center justify-center gap-4 h-[57.5px] border-b-2 border-black bg-white text-black w-full">
         <img :src="profiles[$route.params.id].img" class="w-10 h-10" alt="avatar">
         <p class="text-xl font-medium">{{ profiles[$route.params.id].name }}</p>
      </div>

      <div class="flex flex-row items-center">
         <input type="text" class="w-full p-1.5 border border-t-black" placeholder="Введите сообщение..." />
         <button class="p-1.5 border border-t-black hover:bg-white">Отправить</button>
      </div>
   </div>
  </wrapperComponent>
</template>

<script setup>
import wrapperComponent from '../components/wrapperComponent.vue';
import { profiles } from '../../data/profiles';
</script>

<style>

</style>