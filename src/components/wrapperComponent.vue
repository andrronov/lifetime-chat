<script setup>
import { ref, onMounted } from 'vue';
import leftSidebar from './UI/leftSidebar.vue';
const lightMode = ref(false)

onMounted(() => {
   const localData = localStorage.getItem('userTheme')
   if(localData) lightMode.value = JSON.parse(localData)
})
</script>

<template>
   <div :class="{'dark': lightMode}">
      <div class="bg-indigo-200 dark:text-white dark:bg-indigo-800">
         <div class="min-h-full">
            <div class="grid grid-cols-12 mx-auto gap-0">
               <!-- left sidebar -->
               <div class="md:block col-span-2 xs:col-span-1 sm:col-span-2">
                  <div class="sticky top-0">
                     <leftSidebar />
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