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

// Generate unique randomized avatars from randomuser.me (1-99) on each page load/refresh
function createAvatarGenerator(gender: "men" | "women") {
  const pool = Array.from({ length: 99 }, (_, i) => i + 1).sort(
    () => Math.random() - 0.5,
  );
  let index = 0;
  return () => {
    const id = pool[index++ % pool.length];
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
  };
}

const getMenAvatar = createAvatarGenerator("men");
const getWomenAvatar = createAvatarGenerator("women");

// Contacts seeded with at least 20 items to satisfy the README specification
export const dummyChats: ChatItem[] = [
  {
    id: 1,
    name: "Tom Holland",
    avatar: getMenAvatar(),
    lastMessage: "Thank you man, appreciate it",
    timestamp: "just now",
    unreadCount: 2,
    isSentByMe: false,
  },
  {
    id: 2,
    name: "Robert Downey JR",
    avatar: getMenAvatar(),
    lastMessage: "Hey, bro. How you doing? I heard that you jus...",
    timestamp: "13:30",
    unreadCount: 0,
    isSentByMe: true, // Shows double checkmarks ✓✓
  },
  {
    id: 3,
    name: "Mark Ruffalo",
    avatar: getMenAvatar(),
    lastMessage: "Alright. I'll keep you updated.",
    timestamp: "6 Oct",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 4,
    name: "Chris Hemsworth",
    avatar: getMenAvatar(),
    lastMessage: "Don't worry, I got this.",
    timestamp: "29 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 5,
    name: "Scarlett Johansson",
    avatar: getWomenAvatar(),
    lastMessage: "See you tomorrow at the studio!",
    timestamp: "28 Sep",
    unreadCount: 1,
    isSentByMe: false,
  },
  {
    id: 6,
    name: "Benedict Cumberbatch",
    avatar: getMenAvatar(),
    lastMessage: "The script looks brilliant.",
    timestamp: "25 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 7,
    name: "Chris Evans",
    avatar: getMenAvatar(),
    lastMessage: "Avengers, assemble!",
    timestamp: "22 Sep",
    unreadCount: 0,
    isSentByMe: true,
  },
  {
    id: 8,
    name: "Elizabeth Olsen",
    avatar: getWomenAvatar(),
    lastMessage: "Let me know when you're free to chat.",
    timestamp: "20 Sep",
    unreadCount: 3,
    isSentByMe: false,
  },
  {
    id: 9,
    name: "Chadwick Boseman",
    avatar: getMenAvatar(),
    lastMessage: "Wakanda forever! Talk soon.",
    timestamp: "18 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 10,
    name: "Paul Rudd",
    avatar: getMenAvatar(),
    lastMessage: "Wait, you're not going to believe what happened.",
    timestamp: "15 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 11,
    name: "Zoe Saldana",
    avatar: getWomenAvatar(),
    lastMessage: "Sounds like a solid plan!",
    timestamp: "12 Sep",
    unreadCount: 0,
    isSentByMe: true,
  },
  {
    id: 12,
    name: "Chris Pratt",
    avatar: getMenAvatar(),
    lastMessage: "Awesome Mix Vol 3 is ready!",
    timestamp: "10 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 13,
    name: "Tom Hiddleston",
    avatar: getMenAvatar(),
    lastMessage: "I assure you, the sun will shine on us again.",
    timestamp: "8 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 14,
    name: "Jeremy Renner",
    avatar: getMenAvatar(),
    lastMessage: "Target acquired. Moving in shortly.",
    timestamp: "5 Sep",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 15,
    name: "Samuel L. Jackson",
    avatar: getMenAvatar(),
    lastMessage: "I have an idea for an initiative.",
    timestamp: "1 Sep",
    unreadCount: 0,
    isSentByMe: true,
  },
  {
    id: 16,
    name: "Brie Larson",
    avatar: getWomenAvatar(),
    lastMessage: "Higher, further, faster!",
    timestamp: "28 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 17,
    name: "Anthony Mackie",
    avatar: getMenAvatar(),
    lastMessage: "On your left!",
    timestamp: "24 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 18,
    name: "Sebastian Stan",
    avatar: getMenAvatar(),
    lastMessage: "I remember everything.",
    timestamp: "20 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 19,
    name: "Florence Pugh",
    avatar: getWomenAvatar(),
    lastMessage: "Great work today! Let's celebrate.",
    timestamp: "15 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 20,
    name: "Karen Gillan",
    avatar: getWomenAvatar(),
    lastMessage: "Affirmative. Ready when you are.",
    timestamp: "10 Aug",
    unreadCount: 0,
    isSentByMe: false,
  },
  {
    id: 21,
    name: "Simu Liu",
    avatar: getMenAvatar(),
    lastMessage: "Ten rings, ten times the fun.",
    timestamp: "5 Aug",
    unreadCount: 0,
    isSentByMe: true,
  },
];
