<template>
  <div
    class="min-h-screen bg-brand-bg-light text-brand-text-dark flex justify-center"
  >
    <!-- Main Mobile Container -->
    <div class="w-full max-w-md min-h-screen flex flex-col bg-white relative">
      <!-- HEADER -->
      <header
        class="h-15 px-3 border-b border-slate-200/80 sticky top-0 bg-white/95 backdrop-blur z-20 flex items-center gap-3"
      >
        <!-- Back Navigation Button -->
        <button
          type="button"
          @click="goBack"
          class="p-2 rounded-full text-slate-600 hover:text-brand-blue hover:bg-brand-subtle transition-colors cursor-pointer focus:outline-none"
          title="Back to Chats"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <!-- Contact Avatar -->
        <div class="relative shrink-0">
          <div
            class="w-10 h-10 rounded-full overflow-hidden bg-brand-subtle border border-slate-200 flex items-center justify-center shadow-sm"
          >
            <img
              v-if="currentContact?.avatar && !currentContact?.hasAvatarError"
              :src="currentContact.avatar"
              :alt="currentContact?.name || 'Avatar'"
              class="w-full h-full object-cover"
              @error="handleAvatarError"
            />
            <span v-else class="text-xs font-bold text-brand-blue">
              {{ getInitials(currentContact?.name || "") }}
            </span>
          </div>
        </div>

        <!-- Contact Name -->
        <div class="flex-1 min-w-0">
          <h1
            class="text-base font-bold text-brand-text-dark truncate leading-tight select-none"
          >
            {{ currentContact?.name || "Chat" }}
          </h1>
        </div>
      </header>

      <!-- Message History Thread -->
      <div
        ref="messagesContainerRef"
        class="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-slate-50/50"
      >
        <template v-if="messagesList.length > 0">
          <div
            v-for="msg in messagesList"
            :key="msg.id"
            class="flex flex-col max-w-[82%] leading-snug"
            :class="
              msg.isSentByMe ? 'self-end items-end' : 'self-start items-start'
            "
          >
            <!-- Outgoing Message Bubble (Sent by me) -->
            <div
              v-if="msg.isSentByMe"
              class="rounded-2xl rounded-tr-xs bg-[#4c1d95] text-white p-3 shadow-sm border border-purple-900/30 w-full"
            >
              <div class="flex items-baseline justify-between gap-3 mb-1">
                <span class="text-xs font-semibold text-purple-200/90 truncate">
                  {{ loggedInUser }}
                </span>
                <span class="text-[11px] text-purple-200/70 shrink-0">
                  {{ msg.timestamp }}
                </span>
              </div>
              <p
                class="text-sm text-purple-50 wrap-break-word whitespace-pre-wrap"
              >
                {{ msg.text }}
              </p>
            </div>

            <!-- Incoming Message Bubble (Received from contact) -->
            <div
              v-else
              class="rounded-2xl rounded-tl-xs bg-white text-brand-text-dark p-3 shadow-xs border border-slate-200/80 w-full"
            >
              <div class="flex items-baseline justify-between gap-3 mb-1">
                <span class="text-xs font-semibold text-purple-700 truncate">
                  {{ msg.senderName }}
                </span>
                <span class="text-[11px] text-slate-400 shrink-0">
                  {{ msg.timestamp }}
                </span>
              </div>
              <p
                class="text-sm text-slate-700 wrap-break-word whitespace-pre-wrap"
              >
                {{ msg.text }}
              </p>
            </div>
          </div>
        </template>

        <!-- Empty state when no messages exist yet -->
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center py-20 text-center select-none"
        >
          <p class="text-sm text-slate-400">No messages yet. Say hello!</p>
        </div>
      </div>

      <!-- BOTTOM INPUT BAR -->
      <footer
        class="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200/80 p-3 px-4 z-20"
      >
        <form
          @submit.prevent="handleSend"
          class="flex items-center gap-2 bg-slate-100 hover:bg-slate-100/90 focus-within:bg-white focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-500/20 border border-transparent rounded-full px-4 py-2 transition-all"
        >
          <input
            v-model="inputText"
            type="text"
            placeholder="Type your message here"
            class="flex-1 bg-transparent text-sm text-brand-text-dark placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            :disabled="!inputText.trim()"
            class="p-1 text-purple-600 hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            title="Send message"
          >
            <!-- Paper Plane Send Icon matching wireframe -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 fill-current -translate-y-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { type Message } from "../helper/messagesData";
import { useChatStore } from "../helper/chatStore";
import { loggedInUser } from "../helper/user";

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();

const chatId = computed(() => Number(route.params.id));
const currentContact = computed(() => chatStore.getChatById(chatId.value));
const messagesList = computed<Message[]>(() =>
  chatStore.getMessagesForChat(chatId.value),
);

const inputText = ref("");
const messagesContainerRef = ref<HTMLDivElement | null>(null);

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name[0] || "?").toUpperCase();
}

function handleAvatarError() {
  if (currentContact.value) {
    currentContact.value.hasAvatarError = true;
  }
}

function scrollToBottom(smooth = false) {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTo({
        top: messagesContainerRef.value.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  });
}

function handleSend() {
  const text = inputText.value.trim();
  if (!text) return;

  chatStore.sendMessage(chatId.value, text);
  inputText.value = "";
  scrollToBottom(true);
}

function goBack() {
  router.push({ name: "ChatList" });
}

onMounted(() => {
  chatStore.markAsRead(chatId.value);
  scrollToBottom(false);
});
</script>

<style scoped></style>
