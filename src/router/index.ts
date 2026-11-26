import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login.vue";
import ChatView from "../views/chatView.vue";

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
  },
  {
    path: "/chat/:id",
    name: "ChatDetail",
    component: ChatView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
