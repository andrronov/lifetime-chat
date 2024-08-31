<template>
  <wrapperComponent>
    <div class="relative flex flex-col h-screen justify-between">
      <div
        v-if="$route.params.id"
        class="flex flex-row items-center justify-center gap-4 h-[66.5px] border-b-2 border-black bg-white dark:bg-indigo-950 dark:text-white text-black w-full"
      >
        <img
          :src="profiles[$route.params.id].img"
          class="w-10 h-10"
          alt="avatar"
        />
        <p class="text-xl font-medium">{{ profiles[$route.params.id].name }}</p>
        <onlineIndicator :is-online="isOnline" />
      </div>

      <div
        v-if="$route.params.id && store.$state.chatMessages"
        id="chat"
        ref="chatView"
        class="h-full w-full flex flex-col overflow-y-auto bg-gradient-to-r from-indigo-300 to-green-300 dark:bg-gradient-to-r dark:from-indigo-800 dark:to-green-800"
      >
        <p
          v-for="(msg, index) in chatMessagesComp"
          :key="index"
          class="p-2 my-2 border border-black text-white h-auto mx-px break-words max-w-[210px] xs:max-w-[395px] sm:max-w-2xl"
          :class="
            msg.userId === store.$state.user.id
              ? 'bg-green-700 self-end'
              : 'bg-indigo-700 self-start'
          "
        >
          {{ msg.message }}
        </p>
      </div>

      <div v-if="$route.params.id" class="flex flex-row items-center">
        <input
          @keydown.enter="sendMessage"
          @input="setTypingIndicator"
          v-model="input"
          ref="inputview"
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
  </wrapperComponent>
</template>

<script setup>
import { watchEffect, onMounted, onBeforeUnmount, computed, ref, watch } from "vue";
import wrapperComponent from "../components/wrapperComponent.vue";
import onlineIndicator from "../components/UI/onlineIndicator.vue";
import { profiles } from "../../data/profiles";
import socket from "../socket/index.js";
import { useDataStore } from "../store";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const store = useDataStore();
const input = ref("");
const chatView = ref(null);
const inputview = ref(null);

const isOnline = computed(() =>
  store.$state.onlineUsers.includes(Number(route.params.id))
);
const chatMessagesComp = computed(() => {
  return store.$state.chatMessages[
    getChatId(store.$state.user.id, route.params.id)
  ];
});

function getChatId(fromUserId, toUserId) {
  const idArray = Array.from(arguments);
  const chatId = idArray
    .sort((a, b) => a - b)
    .reduce((acc, curent) => String(acc) + String(curent));
  return chatId;
}

function scrollChat(view) {
  view.scrollTop = chatView.value.scrollHeight;
  chatView.value = null;
}

function sendMessage() {
  if (input.value.trim().length > 0) {
    const chatId = getChatId(store.$state.user.id, route.params.id);
    socket.send(
      JSON.stringify({
        type: "msg",
        method: "sendMessage",
        chatId,
        users: [store.$state.user.id, route.params.id],
        userId: store.$state.user.id,
        input: input.value,
      })
    );
    input.value = "";
  }
}

watchEffect(() => {
  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "connection",
        method: "connection",
        user: JSON.parse(sessionStorage.getItem("userProfile")),
        pin: JSON.parse(sessionStorage.getItem("userPin")) || null,
      })
    );
    socket.send(
      JSON.stringify({
        type: "msg",
        method: "getMessages",
      })
    );
  };

  socket.onmessage = (msg) => {
    const parsedMessage = JSON.parse(msg.data);
    switch (parsedMessage.method) {
      case "connection":
        if (sessionStorage.getItem("userPin") == null)
          sessionStorage.setItem("userPin", JSON.stringify(parsedMessage.pin));
        store.setOnlineUsers(parsedMessage.users);
        break;
      case "disconnection":
        store.setOnlineUsers(parsedMessage.users);
        break;
      case "sentMsg":
        store.addMessage(parsedMessage.chatId, {
          userId: parsedMessage.data.author,
          message: parsedMessage.data.newMessage,
        });
        break;
      case "chatMessages":
        store.setMessages(parsedMessage.msgs);
        break;
      case "abort":
        sessionStorage.setItem("error", JSON.stringify(store.$state.user.id));
        router.push("error");
        break;
      default:
        break;
    }
  };

  // Chat scrolling
  if (chatView.value) {
    const view = chatView.value;
    scrollChat(view);
  }
  // Input focus
  if (inputview.value) inputview.value.focus();
});

watch(route, () => {
  const chatId = getChatId(store.$state.user.id, route.params.id);
  socket.send(
    JSON.stringify({
      type: "msg",
      method: "getMessages",
      chatId,
    })
  );
});

onBeforeUnmount(() => {
  if (router.currentRoute.value.name === "home") {
    socket.send(
      JSON.stringify({
        type: "connection",
        method: "disconnection",
        user: store.$state.user,
      })
    );
    store.userLogout();
  }
});
</script>
