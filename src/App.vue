<script setup>
import { onBeforeUnmount } from "vue";
import { useMessengerStore } from "@/store/messenger";

const messengerStore = useMessengerStore();

onBeforeUnmount(() => {
  messengerStore.close();
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
