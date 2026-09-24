"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import FollowButton from "@/components/profile/FollowButton";
import Avatar from "@/components/ui/Avatar";
import Loader from "@/components/ui/Loader";
import api from "@/lib/api";
import type { User } from "@/types/user";

interface DiscoverResponse {
  users: User[];
  page: number;
  hasMore: boolean;
}

export default function PeoplePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get<DiscoverResponse>("/users/discover")
      .then(({ data }) => {
        if (!active) return;
        setUsers(data.users);
        setPage(data.page);
        setHasMore(data.hasMore);
      })
      .catch((requestError) => {
        console.error("Unable to load people", requestError);
        if (active) setError("People could not be loaded. Please try again.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setError("");
    try {
      const { data } = await api.get<DiscoverResponse>(`/users/discover?page=${page + 1}`);
      setUsers((current) => [...current, ...data.users.filter((next) => !current.some((item) => item._id === next._id))]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (requestError) {
      console.error("Unable to load more people", requestError);
      setError("More people could not be loaded. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <MainLayout>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-bold">People</h1>
        <p className="text-sm text-gray-500">Discover registered users and follow their posts.</p>
      </header>
      {loading ? <Loader /> : users.length ? (
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <article key={user._id} className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50">
              <Link href={`/profile/${user.username}`} aria-label={`Open ${user.name}'s profile`}>
                <Avatar src={user.avatar} alt={user.name} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/profile/${user.username}`} className="truncate font-bold text-gray-900 hover:underline">{user.name}</Link>
                <p className="truncate text-sm text-gray-500">@{user.username}</p>
                {user.bio && <p className="mt-1 line-clamp-2 text-sm text-gray-700">{user.bio}</p>}
                <p className="mt-1 text-xs text-gray-500">{user.followers?.length ?? 0} followers</p>
              </div>
              <FollowButton user={user} />
            </article>
          ))}
        </div>
      ) : (
        <p className="p-8 text-center text-gray-500">No other registered users yet.</p>
      )}
      {error && <p role="alert" className="px-4 py-3 text-center text-sm text-red-600">{error}</p>}
      {hasMore && !loading && (
        <div className="p-4 text-center">
          <button type="button" onClick={() => void loadMore()} disabled={loadingMore} className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {loadingMore ? "Loading..." : "Show more people"}
          </button>
        </div>
      )}
    </MainLayout>
  );
}
