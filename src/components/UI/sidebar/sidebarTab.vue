<template>
   <div>
      <router-link :to="link" :class="isActive" class="flex flex-row border-y-2 border-black dark:border-white hover:font-bold items-center sm:justify-start justify-center p-3 gap-1">
        <div>
          <slot name="icon"></slot>
        </div>
        <div class="hidden sm:block text-black">
          <slot name="name"></slot>
        </div>
      </router-link>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const pIsActive = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: '/'
  }
})
const isActive = computed(() => pIsActive.active ? 'bg-white text-black dark:bg-black dark:text-white' : 'font-normal dark:text-black text-white')
</script>