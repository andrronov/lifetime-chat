<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { useMessengerStore } from "@/store/messenger";
import { LoadingScreen } from "@/components";
import { profiles } from "../../data/profiles.js";

const router = useRouter();
const userStore = useUserStore();
const messengerStore = useMessengerStore();

const users = computed(() => {
  return profiles.map((profile) => ({
    ...profile,
    notAvailable: messengerStore.companionOnline(profile.id),
  }));
});

const selectProfile = (profile) => {
  userStore.signIn(profile);
  messengerStore.connectUser(profile);
  router.push("/chat");
};

onMounted(() => {
  messengerStore.getUsers();
});
</script>

<template>
  <LoadingScreen v-if="loading" />
  <div
    class="flex flex-col px-2 sm:px-0 bg-indigo-200 justify-center items-center h-screen"
  >
    <h1 class="mb-8 font-semibold text-xl">Выберите профиль:</h1>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
      <div
        v-for="profile in users"
        :key="profile.id"
        @click="selectProfile(profile)"
        :class="{ 'opacity-25 pointer-events-none': profile.notAvailable }"
        class="flex flex-row items-center justify-between gap-8 p-4 border-2 rounded-lg border-gray-800 cursor-pointer hover:bg-indigo-800 hover:text-white hover:scale-110 transition-transform duration-300 ease-in-out"
      >
        <p class="text-lg text-center">{{ profile.name }}</p>
        <img :src="profile.img" class="w-12 h-12" alt="avatar" />
      </div>
    </div>
  </div>
</template>
