"use client";

import Link from "next/link";
import Avatar from "../ui/Avatar";
import { Tweet } from "@/types/tweet";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ReplyCard({
  tweet,
}: {
  tweet: Tweet;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-gray-100 px-4 py-3 transition-colors hover:bg-black/[0.015]"
    >
      <div className="flex gap-3">
        <Link href={`/profile/${tweet.author.username}`} className="shrink-0">
          <Avatar
            src={tweet.author.avatar}
            alt={tweet.author.name}
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 leading-5">
            <Link
              href={`/profile/${tweet.author.username}`}
              className="font-bold text-gray-900 text-[15px] truncate hover:underline"
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

          <p className="mt-1 text-[15px] leading-normal text-gray-900 whitespace-pre-wrap break-words">
            {tweet.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}