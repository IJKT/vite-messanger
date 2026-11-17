import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login.vue";
import ChatList from "../views/chatList.vue";

const routes = [
  {
    path: "/", // Default page / URL path
    name: "Login",
    component: Login,
  },
  {
    path: "/chat",
    name: "ChatList",
    component: ChatList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
