import { createRouter, createWebHashHistory } from "vue-router";
import { useUserStore } from "@/store/user";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/chat",
    name: "chatPage",
    component: () => import("@/pages/Chat.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/chat/:id",
    name: "chat",
    component: () => import("@/pages/Chat.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error",
    component: () => import("@/pages/Error.vue"),
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = userStore.user.id;

  if (requiresAuth && !isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
