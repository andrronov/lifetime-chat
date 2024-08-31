<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import leftSidebar from './UI/leftSidebar.vue';


const lightMode = ref(false)
const showModal = ref(false)
const router = useRouter()

function changeTheme(){
   lightMode.value = !lightMode.value; showModal.value = false; localStorage.setItem('userTheme', JSON.stringify(lightMode.value))
}
function exit(){window.location.reload(); router.push('/')}


onMounted(() => {
   const localData = localStorage.getItem('userTheme')
   if(localData) lightMode.value = JSON.parse(localData)
})
</script>

<template>
   <transition>
      <div v-if="showModal" class="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
         <div class="bg-white p-4 rounded-lg">
            <p class="mb-4">Хотите поменять цветовую тему?</p>
            <div class="flex justify-between">
               <button @click="changeTheme" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Да
               </button>
               <button @click="showModal = false" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Нет
               </button>
            </div>
         </div>
      </div>
   </transition>

   <div :class="{'dark': lightMode}">
      <div class="bg-indigo-200 dark:text-white dark:bg-indigo-800">
         <div class="min-h-full">
            <div class="grid grid-cols-12 mx-auto gap-0">
               <!-- left sidebar -->
               <div class="md:block col-span-2 xs:col-span-1 sm:col-span-2">
                  <div class="sticky top-0">
                     <leftSidebar @open-modal="showModal = true" @exit="exit" />
                  </div>
               </div>
 
               <!-- main content -->
               <main class="col-span-10 xs:col-span-11 md:col-span-10">
                  <slot />
               </main>
 
            </div>
         </div>
      </div>
   </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>