"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import Loader from "@/components/ui/Loader";

import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";

import { Conversation } from "@/types/message";

function MessagesContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useSocket();

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [selected, setSelected] =
    useState<Conversation | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data } = await api.get(
          "/messages/conversations"
        );

        const list = data as Conversation[];
        const requestedId = searchParams.get("conversation");
        setConversations(list);
        setSelected(requestedId ? list.find((conversation) => conversation._id === requestedId) || null : null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, searchParams]);

  return (
    <MainLayout>
      <div className="flex h-screen overflow-hidden">
        {loading ? (
          <Loader />
        ) : (
          <>
            <ConversationList
              conversations={conversations}
              currentUserId={user?._id || ""}
              selectedId={selected?._id}
              onSelect={(conversation) => {
                setSelected(conversation);
                setConversations((items) => items.map((item) => item._id === conversation._id ? { ...item, unreadCount: 0 } : item));
              }}
            />

            <ChatWindow
              conversation={selected}
              currentUserId={user?._id || ""}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default function MessagesPage() {
  return <Suspense fallback={<MainLayout><Loader /></MainLayout>}><MessagesContent /></Suspense>;
}
