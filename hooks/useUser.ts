"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "@/types/user";

export function useUser(username: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const { data } = await api.get<User>(`/users/${encodeURIComponent(username)}`);

        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  return {
    user,
    loading,
  };
}
