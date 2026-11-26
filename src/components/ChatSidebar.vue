<template>
  <div class="h-full flex flex-col bg-white dark:bg-brand-bg-dark">
    <!-- HEADER (Fixed height to prevent any layout shift) -->
    <header
      class="h-15 px-4 border-b border-slate-200/80 dark:border-brand-deep-tint shrink-0 bg-white/95 dark:bg-brand-bg-dark/95 backdrop-blur z-20 flex items-center justify-between gap-3"
    >
      <!-- LEFT AREA: Closed -> Logo & Title; Open -> Search Bar Input -->
      <div class="flex-1 min-w-0 flex items-center">
        <!-- Close -> Default Header State -->
        <div v-if="!isSearchOpen" class="flex items-center gap-2.5">
          <img
            src="../images/Message Icon.png"
            alt="Application Logo"
            class="w-9 h-9 object-contain"
          />
          <h1
            class="text-lg font-bold tracking-tight text-brand-text-dark dark:text-brand-text-light select-none"
          >
            Messenger App
          </h1>
        </div>

        <!-- Open -> Search Input Bar -->
        <div v-else class="relative w-full flex items-center">
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Search by contact name..."
            class="w-full pl-3.5 pr-3 py-2 bg-slate-100 dark:bg-brand-deep-tint/70 hover:bg-slate-100/90 dark:hover:bg-brand-deep-tint focus:bg-white dark:focus:bg-brand-deep-tint border border-transparent focus:border-brand-blue/30 dark:focus:border-brand-accent/50 rounded-xl text-sm text-brand-text-dark dark:text-brand-text-light placeholder:text-slate-400 dark:placeholder:text-brand-text-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/20 dark:focus:ring-brand-accent/30"
            @keydown.esc="closeSearch"
          />
        </div>
      </div>

      <!-- RIGHT AREA: Theme Toggle + Search / Close button -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          type="button"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="p-2 rounded-full text-slate-500 dark:text-brand-text-muted-dark hover:text-brand-blue dark:hover:text-brand-accent hover:bg-brand-subtle dark:hover:bg-brand-deep-tint cursor-pointer focus:outline-none shrink-0"
          @click="emit('toggle-dark')"
        >
          <!-- Sun icon (shown in dark mode) -->
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <button
          v-if="!isSearchOpen"
          type="button"
          title="Search chats"
          class="p-2 rounded-full text-slate-500 dark:text-brand-text-muted-dark hover:text-brand-blue dark:hover:text-brand-accent hover:bg-brand-subtle dark:hover:bg-brand-deep-tint cursor-pointer focus:outline-none shrink-0"
          @click="openSearch"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <button
          v-else
          type="button"
          title="Clear or close search"
          class="p-2 rounded-full text-slate-500 dark:text-brand-text-muted-dark hover:text-brand-blue dark:hover:text-brand-accent hover:bg-brand-subtle dark:hover:bg-brand-deep-tint cursor-pointer focus:outline-none shrink-0"
          @click="handleClearOrClose"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Chat list -->
    <div
      class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-brand-deep-tint/70 flex flex-col"
    >
      <!-- Contact Rows -->
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        class="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer"
        :class="
          selectedChatId === chat.id
            ? 'md:bg-brand-subtle/60 dark:md:bg-brand-deep-tint hover:bg-brand-subtle/70 dark:hover:bg-brand-deep-tint'
            : 'hover:bg-brand-subtle/40 dark:hover:bg-brand-deep-tint/50 active:bg-brand-subtle/70 dark:active:bg-brand-deep-tint/80'
        "
        @click="selectChat(chat)"
      >
        <!-- Random Profile Pictures -->
        <div class="relative shrink-0">
          <div
            class="w-13 h-13 rounded-full overflow-hidden bg-brand-subtle dark:bg-brand-deep-tint border border-slate-200 dark:border-brand-accent/25 flex items-center justify-center shadow-sm"
          >
            <img
              v-if="chat.avatar && !chat.hasAvatarError"
              :src="chat.avatar"
              :alt="chat.name"
              class="w-full h-full object-cover"
              loading="lazy"
              @error="chat.hasAvatarError = true"
            />
            <!-- Fallback placeholder avatar if image fails to load -->
            <span
              v-else
              class="text-sm font-bold text-brand-blue dark:text-brand-accent"
            >
              {{ getInitials(chat.name) }}
            </span>
          </div>
        </div>

        <!-- CHAT METADATA -->
        <div class="flex-1 min-w-0 flex flex-col justify-center">
          <!-- Row 1: Contact Name & Timestamp -->
          <div class="flex items-baseline justify-between gap-2 mb-1">
            <h2
              class="text-[16px] font-bold text-brand-text-dark dark:text-brand-text-light truncate leading-tight"
            >
              {{ chat.name }}
            </h2>
            <span
              class="text-xs text-brand-text-muted dark:text-brand-text-muted-dark font-normal whitespace-nowrap shrink-0"
            >
              {{ chat.timestamp }}
            </span>
          </div>

          <!-- Row 2: Message preview & Unread badge -->
          <div class="flex items-center justify-between gap-2">
            <p
              class="text-[14px] text-brand-text-muted dark:text-brand-text-muted-dark truncate leading-snug flex items-center"
            >
              <!-- Double Checkmark (Read status indicator) -->
              <span
                v-if="chat.isSentByMe"
                class="inline-flex items-center text-brand-blue dark:text-brand-accent mr-1.5 shrink-0"
                title="Delivered & Read"
              >
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6L7 17l-5-5" />
                  <path d="M22 10l-7.5 7.5-1.5-1.5" />
                </svg>
              </span>
              <span class="truncate">{{ chat.lastMessage }}</span>
            </p>

            <!-- Unread badge -->
            <span
              v-if="chat.unreadCount && chat.unreadCount > 0"
              class="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-brand-blue dark:bg-brand-accent text-white text-xs font-bold shrink-0 leading-none shadow-sm"
            >
              {{ chat.unreadCount }}
            </span>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE (Exact wireframe: Centered 'No results found') -->
      <div
        v-if="filteredChats.length === 0"
        class="flex-1 flex flex-col items-center justify-center py-28 px-6 text-center select-none"
      >
        <p
          class="text-base font-semibold text-slate-500 dark:text-brand-text-muted-dark"
        >
          No results found
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useChatStore } from "../helper/chatStore";
import type { ChatItem } from "../helper/dummyData";
import { getInitials } from "../helper/user";

defineProps<{
  selectedChatId?: number | null;
  isDark?: boolean;
}>();

const emit = defineEmits<{
  (e: "select-chat", chatId: number): void;
  (e: "toggle-dark"): void;
}>();

const chatStore = useChatStore();

// Reactive chat data from store
const chats = computed(() => chatStore.chats);

// Search state
const isSearchOpen = ref(false);
const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);

// Real-time filter based on every keystroke (strictly matching contact name)
const filteredChats = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return chats.value;
  return chats.value.filter((chat: ChatItem) =>
    chat.name.toLowerCase().includes(query),
  );
});

function openSearch() {
  isSearchOpen.value = true;
  nextTick(() => {
    searchInputRef.value?.focus();
  });
}

function closeSearch() {
  isSearchOpen.value = false;
  searchQuery.value = "";
}

function handleClearOrClose() {
  if (searchQuery.value) {
    searchQuery.value = "";
    searchInputRef.value?.focus();
  } else {
    closeSearch();
  }
}

function selectChat(chat: ChatItem) {
  chatStore.markAsRead(chat.id);
  emit("select-chat", chat.id);
}
</script>
