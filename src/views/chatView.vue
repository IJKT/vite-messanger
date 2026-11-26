<template>
  <div
    class="h-dvh w-full flex justify-center md:justify-start bg-brand-bg-light dark:bg-brand-bg-dark text-brand-text-dark dark:text-brand-text-light overflow-hidden"
    :class="{ dark: isDark }"
  >
    <!-- Left Sidebar: Chat List -->
    <aside
      class="w-full max-w-md md:max-w-none md:w-88 lg:w-100 shrink-0 md:border-r md:border-slate-200/80 dark:md:border-brand-deep-tint bg-white dark:bg-brand-bg-dark flex-col h-full"
      :class="activeChatId !== null ? 'hidden md:flex' : 'flex'"
    >
      <ChatSidebar
        :selected-chat-id="activeChatId"
        :is-dark="isDark"
        @select-chat="handleSelectChat"
        @toggle-dark="toggleDark"
      />
    </aside>

    <!-- Right Area: Chat Details or Desktop Empty State -->
    <section
      class="w-full max-w-md md:max-w-none flex-1 flex-col bg-slate-50/50 dark:bg-brand-bg-dark min-w-0 h-full"
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
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatSidebar from "../components/ChatSidebar.vue";
import ChatWindow from "../components/ChatWindow.vue";
import ChatEmptyState from "../components/ChatEmptyState.vue";

const route = useRoute();
const router = useRouter();

const isDark = ref(false);

const activeChatId = computed<number | null>(() => {
  const rawId = route.params.id;
  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
});

function toggleDark() {
  isDark.value = !isDark.value;
}

function handleSelectChat(chatId: number) {
  router.push({ name: "ChatDetail", params: { id: chatId } });
}

function handleBack() {
  router.push({ name: "ChatList" });
}
</script>
