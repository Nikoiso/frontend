"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import FollowButton from "@/components/profile/FollowButton";
import type { User } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import type { Tweet } from "@/types/tweet";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default function RightSidebar() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Tweet[]>([]);
  useEffect(() => {
    let active = true;
    api.get<User[]>("/users/suggestions").then(({ data }) => { if (active) setUsers(data); }).catch((error) => console.error("Unable to load suggestions", error));
    api.get("/posts").then(({ data }) => { if (active) setPosts((data.posts || []).slice(0, 3)); }).catch((error) => console.error("Unable to load recommended posts", error));
    return () => { active = false; };
  }, []);
  return (
    <aside className="sticky top-0 hidden h-screen w-[350px] overflow-y-auto px-4 py-2 xl:block text-black">
      <div className="flex flex-col gap-4">
        
        <div className="sticky top-0 bg-white py-1 z-10">
          <div className="flex h-[42px] items-center rounded-full bg-gray-100 px-4 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-[#1d9bf0] focus-within:border-[#1d9bf0] border border-transparent">
            <button aria-label="Search" className="mr-3 text-gray-500 text-lg">⌕</button>
            <input
              placeholder="Search"
              className="w-full bg-transparent outline-none placeholder:text-gray-500 text-black"
              onKeyDown={(event) => { if (event.key === "Enter" && event.currentTarget.value.trim()) router.push(`/explore?q=${encodeURIComponent(event.currentTarget.value.trim())}`); }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-gray-50 p-4 flex flex-col gap-3 border border-gray-200"
        >
          <h2 className="text-xl font-extrabold leading-tight text-black">
            Subscribe to Premium
          </h2>
          <p className="text-sm text-gray-600 leading-snug">
            Get rid of ads, see your analytics, boost your replies and unlock 20+ features.
          </p>
          <Link href="/premium">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-fit rounded-full bg-[#1d9bf0] px-4 py-2 font-bold text-white transition-colors hover:bg-[#1a8cd8] cursor-pointer"
            >
              Subscribe
            </motion.button>
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="overflow-hidden rounded-2xl bg-gray-50 border border-gray-200"
        >
          <h2 className="px-4 pt-4 pb-2 text-xl font-extrabold text-black">
            What’s happening
          </h2>

          {posts.map((post) => (
            <Link href={`/post/${post._id}`} key={post._id}>
            <motion.div
              whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
              className="cursor-pointer px-4 py-3 transition-colors"
            >
              <p className="text-xs text-gray-500">{post.author.name} · @{post.author.username} · {formatDate(post.createdAt)}</p>
              <p className="font-bold text-sm text-black line-clamp-2">{post.text || "Photo post"}</p>
              {post.image && <img src={post.image} alt="" className="mt-2 max-h-32 w-full rounded-xl object-cover" />}
              <p className="mt-1 text-xs text-gray-500">♥ {post.likes.length} · ↻ {post.reposts.length} · 💬 {Array.isArray(post.replies) ? post.replies.length : post.replies?.length || 0}</p>
            </motion.div>
            </Link>
          ))}
          {posts.length === 0 && <p className="px-4 py-3 text-sm text-gray-500">No recent posts.</p>}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="overflow-hidden rounded-2xl bg-gray-50 border border-gray-200 mb-6"
        >
          <h2 className="px-4 pt-4 pb-2 text-xl font-extrabold text-black">
            Who to follow
          </h2>

          {users.filter((candidate) => candidate._id !== currentUser?._id).map((user) => (
            <motion.div
              key={user._id}
              whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
              className="flex items-center gap-3 px-4 py-3 transition-colors"
            >
              <Link href={`/profile/${user.username}`}><Avatar src={user.avatar} alt={user.name} /></Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <Link href={`/profile/${user.username}`} className="font-bold text-sm truncate text-black hover:underline">{user.name}</Link>
                </div>
                <p className="truncate text-gray-500 text-sm">@{user.username}</p>
              </div>

              <FollowButton user={user} />
            </motion.div>
          ))}
          {users.filter((candidate) => candidate._id !== currentUser?._id).length === 0 && <p className="px-4 py-3 text-sm text-gray-500">No suggestions yet.</p>}
        </motion.section>

      </div>
    </aside>
  );
}
