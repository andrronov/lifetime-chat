<template>
   <div class="w-3 h-3 rounded-full border border-black" :class="isOnline ? 'bg-green-500' : 'bg-black/20 dark:bg-white/20'"></div>
</template>

<script setup>
const props = defineProps({
   isOnline: {
      type: Boolean, default: false
   }
})
</script>