"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import TweetCard from "@/components/tweet/TweetCard";
import Loader from "@/components/ui/Loader";
import api from "@/lib/api";
import type { Tweet } from "@/types/tweet";

type HistoryTab = "history" | "bookmarks";

export default function HistoryPage() {
  const router = useRouter();
  const [tab, setTab] = useState<HistoryTab>("history");
  const [initialized, setInitialized] = useState(false);
  const [posts, setPosts] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    if (requestedTab === "bookmarks") setTab("bookmarks");
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    let active = true;
    setLoading(true);
    setError("");
    api.get<Tweet[]>(tab === "bookmarks" ? "/posts/bookmarks" : "/posts/history")
      .then(({ data }) => { if (active) setPosts(data); })
      .catch((requestError) => {
        console.error(`Unable to load ${tab}`, requestError);
        if (active) setError(`Could not load ${tab}. Please try again.`);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [tab, initialized]);

  const selectTab = (nextTab: HistoryTab) => {
    setTab(nextTab);
    router.replace(nextTab === "bookmarks" ? "/history?tab=bookmarks" : "/history", { scroll: false });
  };

  return (
    <MainLayout>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">History</h1>
          <p className="text-sm text-gray-500">Your viewed posts and saved bookmarks.</p>
        </div>
        <div role="tablist" aria-label="History sections" className="flex">
          {(["history", "bookmarks"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => selectTab(item)} className={`flex-1 border-b-2 px-4 py-3 text-sm font-bold capitalize transition-colors hover:bg-gray-50 ${tab === item ? "border-[#1d9bf0] text-gray-900" : "border-transparent text-gray-500"}`}>
              {item}
            </button>
          ))}
        </div>
      </header>
      {loading ? <Loader /> : error ? <p role="alert" className="p-8 text-center text-sm text-red-600">{error}</p> : posts.length ? posts.map((post) => (
        <TweetCard key={`${post._id}-${tab === "history" ? post.viewedAt || "" : "saved"}`} tweet={post} isBookmarked={tab === "bookmarks"} onBookmarkChange={(saved) => { if (!saved && tab === "bookmarks") setPosts((items) => items.filter((item) => item._id !== post._id)); }} />
      )) : <p className="p-8 text-center text-gray-500">{tab === "bookmarks" ? "No bookmarks yet." : "No recently viewed posts."}</p>}
    </MainLayout>
  );
}
