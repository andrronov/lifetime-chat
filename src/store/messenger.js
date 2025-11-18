import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { defineStore } from "pinia";
import { useWebSocket } from "@vueuse/core";
import { useUserStore } from "@/store/user";

export const useMessengerStore = defineStore("messenger", () => {
  const userStore = useUserStore();
  const route = useRoute();
  const router = useRouter();

  const onlineUsers = ref([]);
  const chatMessages = ref({});
  const typing = ref(false);

  const chatId = computed(() => {
    const userId = userStore.user.id;
    const routeId = route.params.id;

    if (userId != null && routeId != null) {
      const id = [userId, routeId]
        .sort((a, b) => a - b)
        .reduce((acc, curent) => String(acc) + String(curent));
      return Number(id);
    }
  });

  const currentChatMessages = computed(() => {
    return chatMessages.value[chatId.value];
  });

  const getUsers = () => {
    send(
      JSON.stringify({
        type: "connection",
        method: "users",
      }),
    );
  };

  const companionOnline = (id) => {
    return onlineUsers.value.find((user) => user.id == Number(id));
  };

  const connectUser = (user) => {
    send(
      JSON.stringify({
        type: "connection",
        method: "connection",
        user: user,
        pin: user.pin || null,
      }),
    );
    send(
      JSON.stringify({
        type: "msg",
        method: "getMessages",
      }),
    );
  };

  const receiveMessage = (chatId, message) => {
    if (!chatMessages.value[chatId]) {
      chatMessages.value[chatId] = [message];
    } else {
      chatMessages.value[chatId].push(message);
    }
  };

  const { status, data, send, open, close } = useWebSocket(
    "ws://localhost:5172/",
    {
      heartbeat: {
        interval: 20000,
      },
      onConnected: () => {
        getUsers();
        connectUser(userStore.user);
      },
      onMessage: (event, msg) => {
        if (msg.data === "pong") {
          return;
        }

        const parsedMessage = JSON.parse(msg.data);
        switch (parsedMessage.method) {
          case "users":
            onlineUsers.value = parsedMessage.users;
            break;

          case "connection":
            if (userStore.user.pin == null) {
              userStore.user.pin = parsedMessage.pin;
            }
            onlineUsers.value = parsedMessage.users;
            break;

          case "disconnection":
            onlineUsers.value = parsedMessage.users;
            break;

          case "sentMsg":
            receiveMessage(parsedMessage.chatId, {
              userId: parsedMessage.data.author,
              message: parsedMessage.data.newMessage,
            });
            break;

          case "chatMessages":
            chatMessages.value = parsedMessage.msgs;
            break;

          case "typing":
            if (
              parsedMessage.user === userStore.user.id ||
              parsedMessage.chatId !== chatId.value
            ) {
              return;
            }
            typing.value = true;
            setTimeout(() => {
              typing.value = false;
            }, 2500);
            break;

          case "abort":
            router.push("error");
            break;

          default:
            break;
        }
      },
    },
  );

  return {
    getUsers,
    onlineUsers,
    chatMessages,
    currentChatMessages,
    connectUser,
    companionOnline,
    chatId,
    typing,
    status,
    data,
    send,
    open,
    close,
  };
});
