"use client";

import Link from "next/link";
import { Heart, MessageCircle, Repeat2, Trash2, Bookmark } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Avatar from "../ui/Avatar";
import TweetImage from "./TweetImage";
import { formatCount, formatDate, getTweetImages } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import type { Tweet } from "@/types/tweet";
import { motion } from "framer-motion";

interface TweetCardProps {
  tweet: Tweet; 
  onLike?: () => void; 
  onRepost?: () => void; 
  onDelete?: () => void; 
  onBookmarkChange?: (bookmarked: boolean) => void;
  isBookmarked?: boolean;
}

export default function TweetCard({ tweet, onLike, onRepost, onDelete, onBookmarkChange, isBookmarked = false }: TweetCardProps) {
  const { user } = useAuth();
  const articleRef = useRef<HTMLElement>(null);
  const userId = user?._id;
  const [bookmarked, setBookmarked] = useState(tweet.bookmarks?.some((entry) => (typeof entry === "string" ? entry : entry._id) === user?._id) ?? isBookmarked);
  useEffect(() => {
    const node = articleRef.current;
    if (!node || !userId) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        void api.post(`/posts/${tweet._id}/view`).catch((error) => console.error("Unable to record post view", error));
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [tweet._id, userId]);
  
  const isLiked = tweet.likes.some((like) => (typeof like === "string" ? like : like._id) === user?._id);
  const isReposted = tweet.reposts.some((repost) => (typeof repost === "string" ? repost : repost._id) === user?._id);
  
  const remove = async () => { 
    if (!confirm("Delete this post?")) return; 
    await api.delete(`/posts/${tweet._id}`); 
    onDelete?.(); 
  };
  const toggleBookmark = async () => {
    const previous = bookmarked;
    setBookmarked(!previous);
    try { const { data } = await api.post(`/posts/${tweet._id}/bookmark`); onBookmarkChange?.(data.bookmarked); }
    catch (error) { setBookmarked(previous); console.error("Unable to update bookmark", error); }
  };

  return (
    <motion.article ref={articleRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-gray-100 px-4 py-3 transition-colors hover:bg-black/[0.015]"
    >
      <div className="flex gap-3">
        <Link href={`/profile/${tweet.author.username}`} className="shrink-0">
          <Avatar src={tweet.author.avatar} alt={tweet.author.name} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 leading-5">
            <Link href={`/profile/${tweet.author.username}`} className="font-bold text-gray-900 text-[15px] truncate hover:underline">
              {tweet.author.name}
            </Link>

            <span className="text-gray-500 text-sm truncate">
              @{tweet.author.username}
            </span>

            <span className="text-gray-500 text-sm">·</span>

            <span className="text-gray-500 text-sm hover:underline whitespace-nowrap">
              {formatDate(tweet.createdAt)}
            </span>

            {user?._id === tweet.author._id && (
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => void remove()} 
                className="ml-auto p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors" 
                aria-label="Delete post"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </div>

          <Link href={`/post/${tweet._id}`} className="block">
            {tweet.text && (
              <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-normal text-gray-900">
                {tweet.text}
              </p>
            )}
          </Link>

          <TweetImage images={getTweetImages(tweet)} />

          <div className="mt-3 flex max-w-[425px] justify-between text-gray-500">
            <Link href={`/post/${tweet._id}`}>
              <motion.div whileTap={{ scale: 0.9 }} className="flex items-center gap-1.5 group cursor-pointer">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors">
                  <MessageCircle size={18} />
                </div>
                <span className="text-xs group-hover:text-[#1d9bf0] transition-colors">
                  {formatCount(tweet.replies?.length ?? 0)}
                </span>
              </motion.div>
            </Link>

            <motion.button whileTap={{ scale: 0.9 }} onClick={onRepost} className={`flex items-center gap-1.5 group cursor-pointer ${isReposted ? "text-[#00ba7c]" : ""}`}>
              <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 group-hover:text-[#00ba7c] transition-colors">
                <Repeat2 size={18} />
              </div>
              <span className={`text-xs group-hover:text-[#00ba7c] transition-colors ${isReposted ? "text-[#00ba7c]" : ""}`}>
                {formatCount(tweet.reposts.length)}
              </span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onLike} className={`flex items-center gap-1.5 group cursor-pointer ${isLiked ? "text-[#f91880]" : ""}`}>
              <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 group-hover:text-[#f91880] transition-colors">
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </div>
              <span className={`text-xs group-hover:text-[#f91880] transition-colors ${isLiked ? "text-[#f91880]" : ""}`}>
                {formatCount(tweet.likes.length)}
              </span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => void toggleBookmark()} aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"} className={`flex items-center gap-1.5 group cursor-pointer ${bookmarked ? "text-[#1d9bf0]" : ""}`}>
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors"><Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} /></div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
