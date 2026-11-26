import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login.vue";
import ChatList from "../views/chatList.vue";
import ChatDetail from "../views/chatDetail.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/chat",
    name: "ChatList",
    component: ChatList,
  },
  {
    path: "/chat/:id",
    name: "ChatDetail",
    component: ChatDetail,
    // to pass the chatId as a prop to the ChatDetail component
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
