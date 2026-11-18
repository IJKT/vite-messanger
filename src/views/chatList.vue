<template>
  <div
    class="min-h-screen bg-brand-bg-light text-brand-text-dark flex justify-center"
  >
    <!-- Main Mobile Container -->
    <div
      class="w-full max-w-md min-h-screen flex flex-col bg-white border-x border-slate-200/80 shadow-sm"
    >
      <!-- HEADER -->
      <header
        class="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 sticky top-0 bg-white/95 backdrop-blur z-20"
      >
        <!-- Application Logo using Message Icon.png -->
        <div class="flex items-center gap-2.5">
          <img
            src="../images/Message Icon.png"
            alt="Application Logo"
            class="w-9 h-9 object-contain"
          />
          <h1
            class="text-lg font-bold tracking-tight text-brand-text-dark select-none"
          >
            Messenger App
          </h1>
        </div>

        <div class="flex items-center gap-1">
          <!-- Search Button -->
          <button
            type="button"
            @click="toggleSearch"
            title="Search chats"
            class="p-2 rounded-full text-brand-text-muted hover:text-brand-blue hover:bg-brand-subtle transition-colors focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
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
        </div>
      </header>

      <!-- SEARCH & FILTER BAR -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="max-h-0 opacity-0 -translate-y-2 overflow-hidden"
        enter-to-class="max-h-20 opacity-100 translate-y-0 overflow-hidden"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="max-h-20 opacity-100 translate-y-0 overflow-hidden"
        leave-to-class="max-h-0 opacity-0 -translate-y-2 overflow-hidden"
      >
        <div
          v-if="isSearchOpen"
          class="px-5 py-2.5 bg-brand-subtle/50 border-b border-slate-200"
        >
          <div class="relative flex items-center">
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or message..."
              class="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm text-brand-text-dark placeholder:text-brand-text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              type="button"
              class="absolute right-2.5 text-brand-text-muted hover:text-brand-text-dark text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      </transition>

      <!-- CHAT LIST -->
      <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
        <div
          v-for="chat in filteredChats"
          :key="chat.id"
          @click="selectChat(chat)"
          class="flex items-center gap-3.5 px-5 py-3.5 hover:bg-brand-subtle/40 active:bg-brand-subtle/70 cursor-pointer transition-colors"
        >
          <!-- AVATAR PROFILE PICTURE (Powered by https://randomuser.me) -->
          <div class="relative shrink-0">
            <div
              class="w-13 h-13 rounded-full overflow-hidden bg-brand-subtle border border-slate-200 flex items-center justify-center shadow-sm"
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
              <span v-else class="text-sm font-bold text-brand-blue">
                {{ getInitials(chat.name) }}
              </span>
            </div>
            <!-- Online status indicator -->
            <span
              v-if="chat.isOnline"
              class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
            ></span>
          </div>

          <!-- CHAT METADATA -->
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <!-- Row 1: Contact Name & Timestamp -->
            <div class="flex items-baseline justify-between gap-2 mb-1">
              <h2
                class="text-[16px] font-bold text-brand-text-dark truncate leading-tight"
              >
                {{ chat.name }}
              </h2>
              <span
                class="text-xs text-brand-text-muted font-normal whitespace-nowrap shrink-0"
              >
                {{ chat.timestamp }}
              </span>
            </div>

            <!-- Row 2: Message preview & Unread badge -->
            <div class="flex items-center justify-between gap-2">
              <p
                class="text-[14px] text-brand-text-muted truncate leading-snug flex items-center"
              >
                <!-- Double Checkmark (Read status indicator) -->
                <span
                  v-if="chat.isSentByMe"
                  class="inline-flex items-center text-brand-blue mr-1.5 shrink-0"
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

              <!-- Unread badge (Styled in brand-blue light palette) -->
              <span
                v-if="chat.unreadCount && chat.unreadCount > 0"
                class="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-brand-blue text-white text-xs font-bold shrink-0 leading-none shadow-sm"
              >
                {{ chat.unreadCount }}
              </span>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE (When search query has no match) -->
        <div
          v-if="filteredChats.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center text-brand-text-muted gap-3"
        >
          <div
            class="w-12 h-12 rounded-full bg-brand-subtle flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-brand-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p class="text-sm font-semibold text-brand-text-dark">
            No chats found
          </p>
          <p class="text-xs text-brand-text-muted max-w-xs">
            We couldn't find any chats matching "{{ searchQuery }}"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";

export interface ChatItem {
  id: number;
  name: string;
  avatar: string;
  hasAvatarError?: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isSentByMe?: boolean;
  isOnline?: boolean;
}

// Pre-seeded chat contacts modeled directly after the user's reference mockup
// Direct portrait URLs from randomuser.me are used for instantaneous rendering
const chats = ref<ChatItem[]>([
  {
    id: 1,
    name: "Tom Holland",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Thank you man, appreciate it",
    timestamp: "just now",
    unreadCount: 2,
    isSentByMe: false,
  },
  {
    id: 2,
    name: "Robert Downey JR",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    lastMessage: "Hey, bro. How you doing? I heard that you jus...",
    timestamp: "13:30",
    unreadCount: 0,
    isSentByMe: true, // Shows double checkmarks ✓✓
  },
  {
    id: 3,
    name: "Mark Ruffalo",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    lastMessage: "Alright. I'll keep you updated.",
    timestamp: "6 Oct",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 4,
    name: "Chris Hemsworth",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    lastMessage: "Don't worry, I got this.",
    timestamp: "29 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
]);

// Search and filter state
const isSearchOpen = ref(false);
const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);
const isLoadingAvatars = ref(false);

function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) {
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  } else {
    searchQuery.value = "";
  }
}

// Real-time filter by name or message
const filteredChats = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return chats.value;
  return chats.value.filter(
    (chat) =>
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query),
  );
});

// Fallback initials generator
function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name[0] || "?").toUpperCase();
}

function selectChat(chat: ChatItem) {
  // Mark as read when clicked
  if (chat.unreadCount && chat.unreadCount > 0) {
    chat.unreadCount = 0;
  }
}

// Fetch random profile pictures from https://randomuser.me API
async function fetchRandomUserAvatars() {
  if (isLoadingAvatars.value) return;
  isLoadingAvatars.value = true;
  try {
    const response = await fetch(
      `https://randomuser.me/api/?results=${chats.value.length}&inc=picture`,
    );
    if (!response.ok) return;
    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      data.results.forEach(
        (
          user: { picture?: { large?: string; medium?: string } },
          index: number,
        ) => {
          if (chats.value[index]) {
            const pic = user.picture?.large || user.picture?.medium;
            if (pic) {
              chats.value[index].avatar = pic;
              chats.value[index].hasAvatarError = false;
            }
          }
        },
      );
    }
  } catch (error) {
    console.warn(
      "Could not reach randomuser.me API, keeping current avatars:",
      error,
    );
  } finally {
    isLoadingAvatars.value = false;
  }
}

onMounted(() => {
  fetchRandomUserAvatars();
});
</script>

<style scoped></style>
