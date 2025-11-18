<script setup>
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
const modelValue = defineModel({ default: false, required: false });

const switchTheme = () => {
  userStore.switchTheme();
  modelValue.value = false;
};
</script>

<template>
  <Transition>
    <div
      v-if="modelValue"
      class="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-4 rounded-lg">
        <p class="mb-4">Хотите поменять цветовую тему?</p>
        <div class="flex justify-between">
          <button
            @click="switchTheme()"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Да
          </button>
          <button
            @click="modelValue = false"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  </Transition>
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
