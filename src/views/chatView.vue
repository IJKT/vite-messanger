<template>
  <div
    class="h-dvh w-full flex justify-center md:justify-start bg-brand-bg-light text-brand-text-dark overflow-hidden"
  >
    <!-- Left Sidebar: Chat List -->
    <aside
      class="w-full max-w-md md:max-w-none md:w-88 lg:w-100 shrink-0 md:border-r md:border-slate-200/80 bg-white flex-col h-full"
      :class="activeChatId !== null ? 'hidden md:flex' : 'flex'"
    >
      <ChatSidebar
        :selected-chat-id="activeChatId"
        @select-chat="handleSelectChat"
      />
    </aside>

    <!-- Right Area: Chat Details or Desktop Empty State -->
    <section
      class="w-full max-w-md md:max-w-none flex-1 flex-col bg-slate-50/50 min-w-0 h-full"
      :class="activeChatId !== null ? 'flex' : 'hidden md:flex'"
    >
      <ChatWindow
        v-if="activeChatId !== null"
        :chat-id="activeChatId"
        @back="handleBack"
      />
      <ChatEmptyState v-else />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatSidebar from "../components/ChatSidebar.vue";
import ChatWindow from "../components/ChatWindow.vue";
import ChatEmptyState from "../components/ChatEmptyState.vue";

const route = useRoute();
const router = useRouter();

const activeChatId = computed<number | null>(() => {
  const rawId = route.params.id;
  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
});

function handleSelectChat(chatId: number) {
  router.push({ name: "ChatDetail", params: { id: chatId } });
}

function handleBack() {
  router.push({ name: "ChatList" });
}
</script>
