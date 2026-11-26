import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login.vue";
import ChatView from "../views/chatView.vue";
import { isAuthenticated } from "../helper/user";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/chat",
    name: "ChatList",
    component: ChatView,
    meta: { requiresAuth: true },
  },
  {
    path: "/chat/:id",
    name: "ChatDetail",
    component: ChatView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: "Login",
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
