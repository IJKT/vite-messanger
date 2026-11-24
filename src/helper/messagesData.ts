import { loggedInUser } from "./user";

export interface Message {
  id: string;
  chatId: number;
  senderName: string;
  text: string;
  timestamp: string;
  isSentByMe: boolean;
}

export function dummyMessages(): Record<number, Message[]> {
  return {
    1: [
      {
        id: "msg-1-1",
        chatId: 1,
        senderName: "Tom Holland",
        text: "Can I have your coffee you left in the fridge? I'm so sleepy.",
        timestamp: "14:39",
        isSentByMe: false,
      },
      {
        id: "msg-1-2",
        chatId: 1,
        senderName: loggedInUser.value,
        text: "Sure, you can have it. I have plenty of them in my car if you need more.",
        timestamp: "14:39",
        isSentByMe: true,
      },
      {
        id: "msg-1-3",
        chatId: 1,
        senderName: "Tom Holland",
        text: "YES!!",
        timestamp: "14:40",
        isSentByMe: false,
      },
      {
        id: "msg-1-4",
        chatId: 1,
        senderName: "Tom Holland",
        text: "Thank you man, appreciate it",
        timestamp: "14:40",
        isSentByMe: false,
      },
    ],
  };
}
