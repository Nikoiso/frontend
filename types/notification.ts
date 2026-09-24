import { User } from "./user";

export interface Notification {
  _id: string;
  type: "like" | "follow" | "reply" | "repost" | "message";
  post?: { _id: string; text?: string; image?: string };
  message?: { _id: string; conversation?: string; text?: string };
  sender: User;
  read: boolean;
  createdAt: string;
}
