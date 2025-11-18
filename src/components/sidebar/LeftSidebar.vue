<script setup>
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/user";
import { useMessengerStore } from "@/store/messenger";
import {
  SidebarTab,
  OnlineIndicator,
  ExitIcon,
  SettingsIcon,
} from "@/components";
import { profiles } from "/data/profiles";

const route = useRoute();
const userStore = useUserStore();
const messengerStore = useMessengerStore();
</script>

<template>
  <div
    class="flex flex-col h-screen border-r-2 bg-red-500/0 border-black dark:border-gray-500"
  >
    <h1
      class="pishi p-1 my-1 text-black break-words dark:text-white text-sm xs:text-xl sm:text-2xl text-center hover:text-gray-800"
    >
      Lifetime chat
    </h1>
    <div class="mt-2 space-y-3 overflow-y-auto">
      <SidebarTab
        :is-visible="userStore.user.id !== profile.id"
        :active="route.path == `/chat/${profile.id}`"
        :link="`/chat/${profile.id}`"
        v-for="profile in profiles"
        :key="profile.id"
      >
        <template v-slot:icon>
          <img
            :src="profile.img"
            class="w-8 h-8 sm:w-10 sm:h-10"
            alt="avatar"
          />
        </template>
        <template v-slot:name>
          {{ profile.name }}
        </template>
        <OnlineIndicator
          class="hidden sm:block"
          :is-online="messengerStore.companionOnline(profile.id)"
        />
      </SidebarTab>

      <SidebarTab
        @click="$emit('openModal')"
        :is-visible="true"
        :active="false"
        :link="`/chat`"
      >
        <template v-slot:icon>
          <SettingsIcon
            class="w-8 h-8 sm:w-10 sm:h-10"
            :class="userStore.theme === 'dark' ? 'text-white' : 'text-black'"
            alt="settings icon"
          />
        </template>
        <template v-slot:name> Настройки </template>
        <p></p>
      </SidebarTab>
      <SidebarTab
        @click="$emit('exit')"
        :is-visible="true"
        :active="false"
        :link="`/chat`"
      >
        <template v-slot:icon>
          <ExitIcon
            class="w-8 h-8 sm:w-10 sm:h-10"
            :class="userStore.theme === 'dark' ? 'text-white' : 'text-black'"
            alt="exit icon"
          />
        </template>
        <template v-slot:name> Выход </template>
        <p></p>
      </SidebarTab>
    </div>

    <div
      class="flex flex-row items-center justify-center mt-auto mb-5 xs:w-full dark:hover:bg-gray-800 dark:hover:text-gray-300 hover:bg-gray-400"
    >
      <div
        v-if="userStore.user"
        class="flex flex-row w-full border-y-2 border-black dark:border-white py-2"
      >
        <img
          :src="userStore.user.img"
          class="object-cover w-full h-full sm:w-10 sm:h-10 xl:w-12 xl:h-12"
        />
        <div class="flex-col ml-2 hidden sm:block">
          <p
            class="text-sm hidden sm:block font-bold dark:text-gray-300 text-gray-800"
          >
            {{ userStore.user.name ?? "Undefined" }}
          </p>
          <p class="text-sm hidden sm:block dark:text-gray-400 text-gray-700">
            id: {{ userStore.user.id }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
