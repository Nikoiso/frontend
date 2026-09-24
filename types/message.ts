import { User } from "./user";

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  text?: string;
  image?: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  updatedAt: string;
  unreadCount?: number;
  lastMessage?: Pick<Message, "text" | "createdAt" | "sender"> | null;
}
