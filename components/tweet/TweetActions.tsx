"use client";

import { MessageCircle, Repeat2, Heart, Share } from "lucide-react";
import { motion } from "framer-motion";

interface TweetActionsProps {
  likes: number;
  replies: number;
  reposts: number;
  isLiked?: boolean;
  isReposted?: boolean;
  onLike?: () => void;
  onRepost?: () => void;
  onReply?: () => void;
}

export default function TweetActions({
  likes,
  replies,
  reposts,
  isLiked = false,
  isReposted = false,
  onLike,
  onRepost,
  onReply,
}: TweetActionsProps) {
  return (
    <div className="mt-3 flex max-w-[425px] justify-between text-gray-500">
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onReply}
        className="group flex items-center gap-1.5 cursor-pointer"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors">
          <MessageCircle size={18} />
        </div>
        <span className="text-xs group-hover:text-[#1d9bf0] transition-colors">
          {replies}
        </span>
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onRepost}
        className={`group flex items-center gap-1.5 cursor-pointer ${isReposted ? "text-[#00ba7c]" : ""}`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-[#00ba7c]/10 group-hover:text-[#00ba7c] transition-colors">
          <Repeat2 size={18} />
        </div>
        <span className={`text-xs group-hover:text-[#00ba7c] transition-colors ${isReposted ? "text-[#00ba7c]" : ""}`}>
          {reposts}
        </span>
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onLike}
        className={`group flex items-center gap-1.5 cursor-pointer ${isLiked ? "text-[#f91880]" : ""}`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-[#f91880]/10 group-hover:text-[#f91880] transition-colors">
          <Heart size={18} className={isLiked ? "fill-[#f91880]" : ""} />
        </div>
        <span className={`text-xs group-hover:text-[#f91880] transition-colors ${isLiked ? "text-[#f91880]" : ""}`}>
          {likes}
        </span>
      </motion.button>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors cursor-pointer group"
      >
        <Share size={18} />
      </motion.button>
    </div>
  );
}