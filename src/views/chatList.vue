<template>
  <div
    class="min-h-screen bg-brand-bg-light text-brand-text-dark flex justify-center"
  >
    <!-- Main Mobile Container -->
    <div
      class="w-full max-w-md min-h-screen flex flex-col bg-white border-x border-slate-200/80 shadow-sm"
    >
      <!-- HEADER (Fixed height to prevent any layout shift) -->
      <header
        class="h-[60px] px-4 border-b border-slate-200/80 sticky top-0 bg-white/95 backdrop-blur z-20 flex items-center justify-between gap-3"
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

// Contacts seeded with at least 20 items to satisfy the README specification
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
  {
    id: 5,
    name: "Scarlett Johansson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "See you tomorrow at the studio!",
    timestamp: "28 Sep",
    unreadCount: 1,
    isSentByMe: false,
  },
  {
    id: 6,
    name: "Benedict Cumberbatch",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    lastMessage: "The script looks brilliant.",
    timestamp: "25 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 7,
    name: "Chris Evans",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    lastMessage: "Avengers, assemble!",
    timestamp: "22 Sep",
    unreadCount: 0,
    isSentByMe: true,
  },
  {
    id: 8,
    name: "Elizabeth Olsen",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    lastMessage: "Let me know when you're free to chat.",
    timestamp: "20 Sep",
    unreadCount: 3,
    isSentByMe: false,
  },
  {
    id: 9,
    name: "Chadwick Boseman",
    avatar: "https://randomuser.me/api/portraits/men/82.jpg",
    lastMessage: "Wakanda forever! Talk soon.",
    timestamp: "18 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 10,
    name: "Paul Rudd",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    lastMessage: "Wait, you're not going to believe what happened.",
    timestamp: "15 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 11,
    name: "Zoe Saldana",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    lastMessage: "Sounds like a solid plan!",
    timestamp: "12 Sep",
    unreadCount: 0,
    isSentByMe: true,
  },
  {
    id: 12,
    name: "Chris Pratt",
    avatar: "https://randomuser.me/api/portraits/men/48.jpg",
    lastMessage: "Awesome Mix Vol 3 is ready!",
    timestamp: "10 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 13,
    name: "Tom Hiddleston",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    lastMessage: "I assure you, the sun will shine on us again.",
    timestamp: "8 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 14,
    name: "Jeremy Renner",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    lastMessage: "Target acquired. Moving in shortly.",
    timestamp: "5 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 15,
    name: "Samuel L. Jackson",
    avatar: "https://randomuser.me/api/portraits/men/71.jpg",
    lastMessage: "I have an idea for an initiative.",
    timestamp: "1 Sep",
    unreadCount: 0,
    isSentByMe: true,
  },
  {
    id: 16,
    name: "Brie Larson",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    lastMessage: "Higher, further, faster!",
    timestamp: "28 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 17,
    name: "Anthony Mackie",
    avatar: "https://randomuser.me/api/portraits/men/19.jpg",
    lastMessage: "On your left!",
    timestamp: "24 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 18,
    name: "Sebastian Stan",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    lastMessage: "I remember everything.",
    timestamp: "20 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 19,
    name: "Florence Pugh",
    avatar: "https://randomuser.me/api/portraits/women/54.jpg",
    lastMessage: "Great work today! Let's celebrate.",
    timestamp: "15 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 20,
    name: "Karen Gillan",
    avatar: "https://randomuser.me/api/portraits/women/79.jpg",
    lastMessage: "Affirmative. Ready when you are.",
    timestamp: "10 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 21,
    name: "Simu Liu",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    lastMessage: "Ten rings, ten times the fun.",
    timestamp: "5 Aug",
    unreadCount: 0,
    isSentByMe: true,
  },
]);

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
  // Mark as read when clicked
  if (chat.unreadCount && chat.unreadCount > 0) {
    chat.unreadCount = 0;
  }
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
