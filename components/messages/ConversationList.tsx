"use client";

import ConversationItem from "./ConversationItem";
import type { Conversation } from "@/types/message";
import { motion } from "framer-motion";

interface Props {
  conversations: Conversation[];
  currentUserId: string;
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
}

export default function ConversationList({
  conversations,
  currentUserId,
  selectedId,
  onSelect,
}: Props) {
  return (
    <motion.aside 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full shrink-0 border-r border-gray-100 md:w-[350px] bg-white h-screen overflow-y-auto flex flex-col"
    >

      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Messages
        </h1>
      </div>

      <div className="flex-1">
        {conversations.length ? (
          conversations.map((conversation, index) => (
            <motion.div
              key={conversation._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <ConversationItem
                conversation={conversation}
                currentUserId={currentUserId}
                active={selectedId === conversation._id}
                onClick={() => onSelect(conversation)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <p className="text-gray-500 text-sm">No conversations yet.</p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}