import { defineStore } from "pinia";
import { useSessionStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", () => {
  const user = useSessionStorage("user", {});
  const theme = useSessionStorage("theme", "light");

  const signIn = (data) => {
    user.value = data;
  };

  const signOut = () => {
    user.value = {};
  };

  const switchTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  return {
    user,
    signIn,
    signOut,
    theme,
    switchTheme,
  };
});
