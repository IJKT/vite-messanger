import { defineStore } from "pinia";
import { ref } from "vue";
import { dummyChats, type ChatItem } from "./dummyData";
import { dummyMessages as initialMessages, type Message } from "./messagesData";
import { loggedInUser, loggedInEmail } from "./user";

export const useChatStore = defineStore("chat", () => {
  const currentUserEmail = loggedInEmail;
  const currentUserName = loggedInUser;
  const chats = ref<ChatItem[]>(dummyChats);

  // Initial messages map seeded from messagesData
  const messages = ref<Record<number, Message[]>>(initialMessages);

  function getChatById(id: number): ChatItem | undefined {
    return chats.value.find((c: ChatItem) => c.id === id);
  }

  function getMessagesForChat(chatId: number): Message[] {
    if (!messages.value[chatId]) {
      const chat = getChatById(chatId);
      if (chat) {
        messages.value[chatId] = [
          {
            id: `msg-${chatId}-init`,
            chatId,
            senderName: chat.isSentByMe ? loggedInUser.value : chat.name,
            text: chat.lastMessage,
            timestamp: chat.timestamp,
            isSentByMe: Boolean(chat.isSentByMe),
          },
        ];
      } else {
        messages.value[chatId] = [];
      }
    }
    return messages.value[chatId];
  }

  function sendMessage(chatId: number, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    const newMsg: Message = {
      id: `msg-${chatId}-${Date.now()}`,
      chatId,
      senderName: loggedInUser.value,
      text: trimmed,
      timestamp: timeString,
      isSentByMe: true,
    };

    if (!messages.value[chatId]) {
      messages.value[chatId] = [];
    }
    messages.value[chatId].push(newMsg);

    // Update the chat list summary
    const chat = getChatById(chatId);
    if (chat) {
      chat.lastMessage = trimmed;
      chat.timestamp = "just now";
      chat.isSentByMe = true;
      chat.unreadCount = 0;
    }
  }

  function markAsRead(chatId: number) {
    const chat = getChatById(chatId);
    if (chat) {
      chat.unreadCount = 0;
    }
  }

  return {
    currentUserEmail,
    currentUserName,
    chats,
    messages,
    getChatById,
    getMessagesForChat,
    sendMessage,
    markAsRead,
  };
});
