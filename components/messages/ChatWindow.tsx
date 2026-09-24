"use client";

import { useEffect, useState, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import Avatar from "../ui/Avatar";
import { motion, AnimatePresence } from "framer-motion";

import api from "@/lib/api";
import { socket } from "@/lib/socket";

import {
  Conversation,
  Message,
} from "@/types/message";

interface Props {
  conversation: Conversation | null;
  currentUserId: string;
}

export default function ChatWindow({
  conversation,
  currentUserId,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = conversation?._id;

  useEffect(() => {
    if (!conversationId) return;
    let active = true;
    setMessages([]);

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(
          `/messages/${conversationId}`
        );
        if (!active) return;
        setMessages((current) => [...new Map([...(data as Message[]), ...current].map((message) => [message._id, message])).values()]);
        const unread = (data as Message[]).filter((message) => !message.read && message.sender._id !== currentUserId);
        await Promise.all(unread.map((message) => api.put(`/messages/read/${message._id}`).catch((error) => console.error("Unable to mark message read", error))));
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();

    const joinConversation = () => socket.emit("joinConversation", conversationId);
    if (socket.connected) joinConversation();
    socket.on("connect", joinConversation);

    const handleMessage = (message: Message) => {
      if (
        message.conversation === conversationId
      ) {
        if (message.sender._id !== currentUserId && !message.read) {
          void api.put(`/messages/read/${message._id}`).catch((error) => console.error("Unable to mark message read", error));
        }
        setMessages((prev) => prev.some((item) => item._id === message._id) ? prev : [...prev, message]);
      }
    };

    socket.on("newMessage", handleMessage);

    return () => {
      active = false;
      socket.off("newMessage", handleMessage);
      socket.off("connect", joinConversation);
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center border-r border-gray-100 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center px-6 max-w-sm"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Select a message
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Choose from your existing conversations, start a new one, or just keep swimming.
          </p>
        </motion.div>
      </div>
    );
  }

  const otherUser = conversation.participants.find(
    (user) => user._id !== currentUserId
  );

  const sendMessage = async (text: string) => {
    if (!socket.connected) {
      await new Promise<void>((resolve) => {
        const timeout = window.setTimeout(() => resolve(), 5000);
        socket.once("connect", () => { window.clearTimeout(timeout); resolve(); });
        socket.connect();
      });
    }
    if (!socket.connected) return;
    socket.emit("sendMessage", {
      conversationId: conversation._id,
      text,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col h-screen border-r border-gray-100 bg-white"
    >
      <motion.header 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 py-3"
      >
        <Avatar
          src={otherUser?.avatar}
          alt={otherUser?.name}
        />
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">
            {otherUser?.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            @{otherUser?.username}
          </p>
        </div>
      </motion.header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <MessageBubble
                message={message}
                currentUserId={currentUserId}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-100">
        <MessageInput onSend={sendMessage} />
      </div>
    </motion.div>
  );
}
