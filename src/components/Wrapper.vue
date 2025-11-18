<script setup>
import { ref } from "vue";
import { useUserStore } from "@/store/user";
import { LeftSidebar, SettingsModal } from "@/components";

const userStore = useUserStore();

const showModal = ref(false);
</script>

<template>
  <SettingsModal v-model="showModal" />
  <div :class="{ dark: userStore.theme === 'dark' }">
    <div class="bg-indigo-200 dark:text-white dark:bg-indigo-800">
      <div class="min-h-full">
        <div class="grid grid-cols-12 mx-auto gap-0">
          <div class="md:block col-span-2 xs:col-span-1 sm:col-span-2">
            <div class="sticky top-0">
              <LeftSidebar
                @open-modal="showModal = true"
                @exit="$emit('exit')"
              />
            </div>
          </div>
          <main class="col-span-10 xs:col-span-11 md:col-span-10">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
