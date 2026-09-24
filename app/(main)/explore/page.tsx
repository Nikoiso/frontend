"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import MainLayout from "@/components/layout/MainLayout";
import SearchBar from "@/components/search/SearchBar";
import UserResult from "@/components/search/UserResult";
import TweetResult from "@/components/search/TweetResult";
import Loader from "@/components/ui/Loader";
import api from "@/lib/api";
import { User } from "@/types/user";
import { Tweet } from "@/types/tweet";

function ExploreContent() {
  const params = useSearchParams();
  const query = params.get("q");

  const [users, setUsers] = useState<User[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeTab, setActiveTab] = useState<"Top" | "Users" | "Posts">("Top");

  useEffect(() => {
    if (!query?.trim()) {
      const timer = window.setTimeout(() => { setUsers([]); setTweets([]); setSearchError(""); }, 0);
      return () => window.clearTimeout(timer);
    }

    let active = true;
    const timer = window.setTimeout(() => {
    const search = async () => {
      try {
        setLoading(true);
        setSearchError("");

        const [usersResponse, postsResponse] = await Promise.all([
          api.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`),
          api.get<Tweet[]>(`/posts/search?q=${encodeURIComponent(query)}`),
        ]);
        if (active) { setUsers(usersResponse.data); setTweets(postsResponse.data); }
      } catch (error) {
        console.error(error);
        if (active) setSearchError("Search is unavailable right now. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void search();
    }, 300);
    return () => { active = false; window.clearTimeout(timer); };
  }, [query]);

  return (
    <MainLayout>
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 py-2.5">
        <SearchBar />
      </div>

      <div className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-xl font-extrabold text-gray-900">
          {query ? `Results for "${query}"` : "Explore"}
        </h1>
      </div>

      {query && (
        <div className="flex border-b border-gray-100 w-full">
          {(["Top", "Users", "Posts"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex-1 py-3.5 text-center font-bold text-sm transition-colors hover:bg-gray-50 group cursor-pointer"
              >
                <span className={`transition-colors ${isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}>
                  {tab}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="exploreActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full mx-auto w-12"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      )}
      {searchError && <p role="alert" className="px-4 py-3 text-sm text-red-600">{searchError}</p>}

      {!loading && query && (
        <div className="divide-y divide-gray-100">
          {(activeTab === "Top" || activeTab === "Users") && users.length > 0 && (
            <div>
              {activeTab === "Top" && users.length > 0 && (
                <div className="px-4 py-2 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  People
                </div>
              )}
              {users.map((user) => (
                <UserResult key={user._id} user={user} />
              ))}
            </div>
          )}

          {(activeTab === "Top" || activeTab === "Posts") && tweets.length > 0 && (
            <div>
              {activeTab === "Top" && tweets.length > 0 && (
                <div className="px-4 py-2 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Posts
                </div>
              )}
              {tweets.map((tweet) => (
                <TweetResult key={tweet._id} tweet={tweet} />
              ))}
            </div>
          )}

          {!loading && users.length === 0 && tweets.length === 0 && query && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center px-4"
            >
              <p className="text-xl font-bold text-gray-900">No results for &quot;{query}&quot;</p>
              <p className="text-sm text-gray-500 mt-1">Try searching for something else or check your spelling.</p>
            </motion.div>
          )}
        </div>
      )}

      {!query && !loading && (
        <div className="py-16 text-center px-4 text-gray-500 text-sm">
          Type something in the search bar above to discover people and posts.
        </div>
      )}
    </MainLayout>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<MainLayout><div className="flex justify-center py-20"><Loader /></div></MainLayout>}>
      <ExploreContent />
    </Suspense>
  );
}
