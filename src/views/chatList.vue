<template>
  <div
    class="min-h-screen bg-brand-bg-light text-brand-text-dark flex justify-center"
  >
    <!-- Main Mobile Container -->
    <div class="w-full max-w-md min-h-screen flex flex-col bg-white">
      <!-- HEADER (Fixed height to prevent any layout shift) -->
      <header
        class="h-15 px-4 border-b border-slate-200/80 sticky top-0 bg-white/95 backdrop-blur z-20 flex items-center justify-between gap-3"
      >
        <!-- LEFT AREA: Closed -> Logo & Title; Open -> Search Bar Input -->
        <div class="flex-1 min-w-0 flex items-center">
          <!--Close -> Default Header State -->
          <div v-if="!isSearchOpen" class="flex items-center gap-2.5">
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

          <!-- Open -> Search Input Bar -->
          <div v-else class="relative w-full flex items-center">
            <!-- Search Input -->
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Search by contact name..."
              @keydown.esc="closeSearch"
              class="w-full pl-3.5 pr-3 py-2 bg-slate-100 hover:bg-slate-100/90 focus:bg-white border border-transparent focus:border-brand-blue/30 rounded-xl text-sm text-brand-text-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>
        </div>

        <!-- RIGHT AREA: Close -> Magnifying Glass Open -> Close button-->
        <!-- Magnifying Glass -->
        <button
          v-if="!isSearchOpen"
          type="button"
          @click="openSearch"
          class="p-2 rounded-full text-slate-500 hover:text-brand-blue hover:bg-brand-subtle transition-colors cursor-pointer focus:outline-none shrink-0"
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

        <!-- Close Button -->
        <button
          v-else
          type="button"
          @click="handleClearOrClose"
          class="p-2 rounded-full text-slate-500 hover:text-brand-blue hover:bg-brand-subtle transition-colors cursor-pointer focus:outline-none shrink-0"
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
      </header>

      <!-- Chat list -->
      <div
        class="flex-1 overflow-y-auto divide-y divide-slate-100 flex flex-col"
      >
        <!-- Contact Rows -->
        <div
          v-for="chat in filteredChats"
          :key="chat.id"
          @click="selectChat(chat)"
          class="flex items-center gap-3.5 px-5 py-3.5 hover:bg-brand-subtle/40 active:bg-brand-subtle/70 cursor-pointer transition-colors"
        >
          <!-- Random Profile Pictures -->
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
          </div>

          <!-- CHAT METADATA -->
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <!-- Row 1: Contact Name & Timestamp -->
            <div class="flex items-baseline justify-between gap-2 mb-1">
              <!-- Contact Name -->
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

              <!-- Unread badge -->
              <span
                v-if="chat.unreadCount && chat.unreadCount > 0"
                class="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-brand-blue text-white text-xs font-bold shrink-0 leading-none shadow-sm"
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
          <p class="text-base font-semibold text-slate-500">No results found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useChatStore } from "../helper/chatStore";
import type { ChatItem } from "../helper/dummyData";

const router = useRouter();
const chatStore = useChatStore();

// Reactive chat data from store
const chats = computed(() => chatStore.chats);

// Search state
const isSearchOpen = ref(false);
const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);
const isLoadingAvatars = ref(false);

// Real-time filter based on every typedown keystroke (strictly matching contact name)
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

// Fallback initials generator
function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name[0] || "?").toUpperCase();
}

function selectChat(chat: ChatItem) {
  chatStore.markAsRead(chat.id);
  router.push({ name: "ChatDetail", params: { id: chat.id } });
}

// Random avatar fetching with graceful fallback
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
      "Could not reach randomuser.me API, using seeded avatars:",
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
