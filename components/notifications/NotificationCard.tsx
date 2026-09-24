"use client";

import Avatar from "../ui/Avatar";
import { Notification } from "@/types/notification";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useState } from "react";

export default function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  const router = useRouter();
  const [read, setRead] = useState(notification.read);
  const open = async () => {
    if (!read) {
      try { await api.put(`/notifications/${notification._id}/read`); setRead(true); }
      catch (error) { console.error("Unable to mark notification read", error); }
    }
    if (notification.type === "message" && notification.message?.conversation) router.push(`/messages?conversation=${notification.message.conversation}`);
    else if (notification.post?._id) router.push(`/post/${notification.post._id}`);
    else router.push(`/profile/${notification.sender.username}`);
  };
  const text = {
    like: "liked your post",
    follow: "followed you",
    reply: "replied to your post",
    repost: "reposted your post",
    message: "sent you a message",
  };


  const icons = {
    like: (
      <span className="text-[#f91880] text-xl">
        ♥
      </span>
    ),
    follow: (
      <span className="text-[#1d9bf0] text-xl">
        👤
      </span>
    ),
    reply: (
      <span className="text-[#1d9bf0] text-xl">
        💬
      </span>
    ),
    repost: (
      <span className="text-[#00ba7c] text-xl">
        🔁
      </span>
    ),
    message: <span className="text-[#1d9bf0] text-xl">✉</span>,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
      onClick={() => void open()}
      className={`flex gap-4 border-b border-gray-100 px-4 py-4 transition-colors cursor-pointer relative ${
        !read ? "bg-[#1d9bf0]/[0.03]" : "bg-white"
      }`}
    >
      <div className="shrink-0 flex items-start pt-0.5">
        {icons[notification.type]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <Avatar
            src={notification.sender.avatar}
            alt={notification.sender.name}
          />
        </div>

        <p className="text-gray-900 text-[15px] leading-snug">
          <b className="font-bold hover:underline">{notification.sender.name}</b>{" "}
          <span className="text-gray-700">{text[notification.type]}</span>
        </p>

        <p className="text-sm text-gray-500 mt-0.5">
          @{notification.sender.username}
        </p>
      </div>

      {!read && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#1d9bf0]" />
      )}
    </motion.div>
  );
}
