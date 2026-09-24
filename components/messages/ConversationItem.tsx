"use client";

import Avatar from "../ui/Avatar";
import { Conversation } from "@/types/message";

interface Props {
  conversation: Conversation;
  currentUserId: string;
  active: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  currentUserId,
  active,
  onClick,
}: Props) {
  const user = conversation.participants.find(
    (participant) =>
      participant._id !== currentUserId
  );

  if (!user) return null;

  return (
    <button
      onClick={onClick}
      className={`flex w-full gap-3 px-4 py-3 text-left hover:bg-gray-100 ${
        active ? "bg-gray-100" : ""
      }`}
    >
      <Avatar
        src={user.avatar}
        alt={user.name}
      />

      <div className="min-w-0">
        <p className="truncate font-bold">
          {user.name}
        </p>

        <p className="truncate text-gray-500">
          @{user.username}
        </p>
      </div>
    </button>
  );
}