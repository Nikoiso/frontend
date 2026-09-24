"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import NotificationCard from "@/components/notifications/NotificationCard";
import Loader from "@/components/ui/Loader";
import api from "@/lib/api";
import { Notification } from "@/types/notification";
import { useSocket } from "@/hooks/useSocket";

export default function NotificationsPage() {
  const socket = useSocket();
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get(
          "/notifications"
        );

        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const receive = (notification: Notification) => setNotifications((items) => items.some((item) => item._id === notification._id) ? items : [notification, ...items]);
    socket.on("notification", receive);
    return () => { socket.off("notification", receive); };
  }, [socket]);

  return (
    <MainLayout>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-bold">
          Notifications
        </h1>
      </header>

      {loading ? (
        <Loader />
      ) : (
        notifications.length === 0 ? <p className="p-8 text-center text-gray-500">You’re all caught up.</p> :
        notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
          />
        ))
      )}
    </MainLayout>
  );
}
