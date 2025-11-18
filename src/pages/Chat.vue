<script setup>
import {
  watchEffect,
  onBeforeUnmount,
  computed,
  ref,
  useTemplateRef,
  nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { watchDebounced } from "@vueuse/core";
import { useMessengerStore } from "@/store/messenger";
import { useUserStore } from "@/store/user";
import { Wrapper, OnlineIndicator, PenIcon } from "@/components";
import { profiles } from "../../data/profiles";

const router = useRouter();
const route = useRoute();
const messengerStore = useMessengerStore();
const userStore = useUserStore();

const input = ref("");
const chatView = useTemplateRef("chatView");
const inputview = useTemplateRef("chatInput");

const chatCompanion = computed(() => {
  return profiles.find((profile) => profile.id == route.params.id);
});

const scrollChat = async () => {
  await nextTick();
  chatView.value.scrollTo(0, chatView.value.scrollHeight - 95);
};

const sendMessage = () => {
  if (input.value.trim().length > 0) {
    messengerStore.send(
      JSON.stringify({
        type: "msg",
        method: "sendMessage",
        chatId: messengerStore.chatId,
        users: [userStore.user.id, route.params.id],
        userId: userStore.user.id,
        input: input.value,
      }),
    );
    scrollChat(chatView.value);
    input.value = "";
  }
};

const leavePage = () => {
  router.push({ name: "home" });
};

watchDebounced(
  () => input.value,
  () => {
    messengerStore.send(
      JSON.stringify({
        type: "msg",
        method: "typing",
        user: userStore.user.id,
        companion: chatCompanion.value.id,
        chat: messengerStore.chatId,
      }),
    );
  },
  { debounce: 500, maxWait: 1000 },
);

watchEffect(() => {
  if (chatView.value && messengerStore.currentChatMessages) {
    scrollChat(chatView.value);
  }
  if (inputview.value) inputview.value.focus();
});

onBeforeUnmount(() => {
  input.value = "";
  messengerStore.send(
    JSON.stringify({
      type: "connection",
      method: "disconnection",
      user: userStore.user,
    }),
  );
  userStore.signOut();
});
</script>

<template>
  <Wrapper @exit="leavePage">
    <div class="relative flex flex-col h-screen justify-between">
      <div
        v-if="chatCompanion"
        class="relative flex flex-row items-center justify-center gap-4 h-[66.5px] border-b-2 border-black bg-white dark:bg-indigo-950 dark:text-white text-black w-full"
      >
        <img :src="chatCompanion.img" class="w-10 h-10" alt="avatar" />
        <p class="text-xl font-medium">{{ chatCompanion.name }}</p>
        <OnlineIndicator
          :is-online="messengerStore.companionOnline(chatCompanion.id)"
        />
        <PenIcon v-if="messengerStore.typing" class="w-7 h-7" alt="pen icon" />
      </div>

      <div
        v-if="messengerStore.currentChatMessages ?? []"
        id="chat"
        ref="chatView"
        class="h-full w-full flex flex-col overflow-y-auto bg-gradient-to-r from-indigo-300 to-green-300 dark:bg-gradient-to-r dark:from-indigo-800 dark:to-green-800"
      >
        <p
          v-for="(msg, index) in messengerStore.currentChatMessages"
          :key="index"
          class="p-2 my-2 border border-black text-white h-auto mx-px break-words max-w-[210px] xs:max-w-[395px] sm:max-w-2xl"
          :class="
            msg.userId === userStore.user.id
              ? 'bg-green-700 self-end'
              : 'bg-indigo-700 self-start'
          "
        >
          {{ msg.message }}
        </p>
      </div>

      <div v-if="chatCompanion" class="flex flex-row items-center">
        <input
          @keydown.enter="sendMessage"
          v-model="input"
          ref="chatInput"
          type="text"
          class="w-full p-2 text-black border-t border-black outline-none focus:border-none"
          placeholder="Введите сообщение..."
        />
        <button
          @click="sendMessage"
          class="p-2 border-t border-black hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          Отправить
        </button>
      </div>

      <div v-else class="my-auto self-center">
        <p class="text-xl font-medium">Выберите чат</p>
      </div>
    </div>
  </Wrapper>
</template>
