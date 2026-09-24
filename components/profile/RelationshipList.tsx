"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import FollowButton from "@/components/profile/FollowButton";
import Avatar from "@/components/ui/Avatar";
import Loader from "@/components/ui/Loader";
import api from "@/lib/api";
import type { User, UserSummary } from "@/types/user";

export default function RelationshipList({ type }: { type: "followers" | "following" }) {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [profile, setProfile] = useState<User | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data: user } = await api.get<User>(`/users/${encodeURIComponent(username)}`);
        const { data: list } = await api.get<UserSummary[]>(`/users/${user._id}/${type}`);
        if (active) {
          setProfile(user);
          setUsers(list.filter(Boolean));
        }
      } catch (requestError) {
        console.error(`Unable to load ${type}`, requestError);
        if (active) setError(`Could not load this ${type} list.`);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [username, type]);

  return (
    <MainLayout>
      <header className="sticky top-0 z-10 flex items-center gap-5 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur">
        <Link href={`/profile/${username}`} aria-label="Back to profile" className="rounded-full p-2 hover:bg-gray-100"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-xl font-bold">{profile?.name ?? `@${username}`}</h1>
          <p className="text-sm text-gray-500">@{username}</p>
        </div>
      </header>
      <div className="flex border-b border-gray-100">
        <Link href={`/profile/${username}/following`} className={`flex-1 border-b-2 px-4 py-3 text-center text-sm font-bold ${type === "following" ? "border-[#1d9bf0] text-gray-900" : "border-transparent text-gray-500"}`}>Following</Link>
        <Link href={`/profile/${username}/followers`} className={`flex-1 border-b-2 px-4 py-3 text-center text-sm font-bold ${type === "followers" ? "border-[#1d9bf0] text-gray-900" : "border-transparent text-gray-500"}`}>Followers</Link>
      </div>
      {loading ? <Loader /> : error ? <p role="alert" className="p-8 text-center text-sm text-red-600">{error}</p> : users.length ? (
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <article key={user._id} className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50">
              <Link href={`/profile/${user.username}`} aria-label={`Open ${user.name}'s profile`}><Avatar src={user.avatar} alt={user.name} /></Link>
              <div className="min-w-0 flex-1">
                <Link href={`/profile/${user.username}`} className="block truncate font-bold text-gray-900 hover:underline">{user.name}</Link>
                <p className="truncate text-sm text-gray-500">@{user.username}</p>
                {user.bio && <p className="mt-1 line-clamp-2 text-sm text-gray-700">{user.bio}</p>}
              </div>
              <FollowButton user={user} />
            </article>
          ))}
        </div>
      ) : (
        <p className="p-8 text-center text-gray-500">{profile?.name ?? "This user"} has no {type} yet.</p>
      )}
    </MainLayout>
  );
}
