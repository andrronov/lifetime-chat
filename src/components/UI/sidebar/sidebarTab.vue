<template>
   <div v-if="isVisible">
      <router-link :to="link" :class="isActive" class="flex flex-row justify-between border-y-2 border-black dark:border-white hover:font-bold items-center w-full p-3 gap-2">
        <div>
          <slot name="icon"></slot>
        </div>
        <div class="hidden sm:block text-black">
          <slot name="name"></slot>
        </div>
        <slot />
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
  },
  isVisible: {
    type: Boolean,
    default: true
  }
})
const isActive = computed(() => pIsActive.active ? 'bg-white text-black dark:bg-black dark:text-white' : 'font-normal dark:text-black text-white')
</script>