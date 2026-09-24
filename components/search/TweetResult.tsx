"use client";

import Link from "next/link";
import { MessageCircle, Repeat2, Heart, Share } from "lucide-react";
import { Tweet } from "@/types/tweet";
import Avatar from "@/components/ui/Avatar";
import { formatDate, formatCount, getTweetImages } from "@/lib/utils";
import { motion } from "framer-motion";

interface TweetResultProps {
  tweet: Tweet;
}

export default function TweetResult({ tweet }: TweetResultProps) {
  const images = getTweetImages(tweet);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-gray-100 px-4 py-3 transition-colors hover:bg-black/[0.015] cursor-pointer"
    >
      <div className="flex gap-3">
        <Link href={`/profile/${tweet.author.username}`} className="shrink-0">
          <Avatar
            src={tweet.author.avatar}
            alt={tweet.author.name}
            size="md"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 leading-5">
            <Link
              href={`/profile/${tweet.author.username}`}
              className="font-bold text-gray-900 hover:underline truncate"
            >
              {tweet.author.name}
            </Link>

            <span className="text-gray-500 text-sm truncate">
              @{tweet.author.username}
            </span>

            <span className="text-gray-500 text-sm">·</span>

            <span className="text-gray-500 text-sm hover:underline whitespace-nowrap">
              {formatDate(tweet.createdAt)}
            </span>
          </div>

          <Link href={`/post/${tweet._id}`} className="block">
            {tweet.text && (
              <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-normal text-gray-900">
                {tweet.text}
              </p>
            )}

            {images.length > 0 && (
              <div className="mt-3">
                <div
                  className={`grid gap-1.5 overflow-hidden rounded-2xl border border-gray-100 ${
                    images.length === 1
                      ? "grid-cols-1"
                      : images.length === 3
                      ? "grid-cols-2"
                      : "grid-cols-2"
                  }`}
                >
                  {images.slice(0, 4).map((image, index) => (
                    <div 
                      key={index} 
                      className={`relative overflow-hidden bg-gray-100 ${
                        images.length === 3 && index === 0 ? "row-span-2" : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Tweet image ${index + 1}`}
                        className="max-h-[350px] w-full object-cover hover:scale-[1.01] transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Link>

          <div className="mt-3 flex max-w-[425px] justify-between text-gray-500">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-xs group-hover:text-[#1d9bf0] transition-colors">
                {formatCount(tweet.replies?.length ?? 0)}
              </span>
            </motion.div>

            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 group-hover:text-[#00ba7c] transition-colors">
                <Repeat2 size={18} />
              </div>
              <span className="text-xs group-hover:text-[#00ba7c] transition-colors">
                {formatCount(tweet.reposts?.length ?? 0)}
              </span>
            </motion.div>

            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 group-hover:text-[#f91880] transition-colors">
                <Heart size={18} />
              </div>
              <span className="text-xs group-hover:text-[#f91880] transition-colors">
                {formatCount(tweet.likes?.length ?? 0)}
              </span>
            </motion.div>

            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="flex items-center group cursor-pointer"
            >
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors">
                <Share size={18} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}