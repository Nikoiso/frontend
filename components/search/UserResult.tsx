"use client";

import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import type { User } from "@/types/user";
import { motion } from "framer-motion";

export default function UserResult({ user }: { user: User }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/profile/${user.username}`}
        className="flex gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-black/[0.015] block"
      >
        <div className="shrink-0">
          <Avatar src={user.avatar} alt={user.name} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-gray-900 text-[15px] truncate hover:underline">
            {user.name}
          </p>

          <p className="text-sm text-gray-500 truncate">
            @{user.username}
          </p>

          {user.bio && (
            <p className="mt-1.5 text-sm text-gray-900 whitespace-pre-wrap leading-snug line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}