"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import type { PaginatedPostsResponse, Tweet } from "@/types/tweet";
export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshTweets = useCallback(async () => {
    try { setLoading(true); const { data } = await api.get<PaginatedPostsResponse | Tweet[]>("/posts"); setTweets(Array.isArray(data) ? data : data.posts); }
    catch (error) { console.error("Unable to load posts", error); setTweets([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => { void refreshTweets(); }, 0); return () => window.clearTimeout(timer); }, [refreshTweets]);
  return { tweets, loading, refreshTweets };
}
