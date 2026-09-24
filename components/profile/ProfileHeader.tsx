"use client";

import Avatar from "../ui/Avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface Props {
  user: User;
  isOwnProfile: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
  onFollowChange?: (following: boolean) => void;
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  onEdit,
  onMessage,
  onFollowChange,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="border-b border-gray-100 pb-4 bg-white"
    >
      <div className="h-[200px] bg-gray-200 relative overflow-hidden">
        {user.coverImage && (
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            src={user.coverImage}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="relative px-4 pb-3">
        <div className="-mt-16 mb-4 flex items-end justify-between">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="rounded-full p-1 bg-white shadow-md"
          >
            <Avatar src={user.avatar} alt={user.name} size="lg" />
          </motion.div>

          {isOwnProfile ? (
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="rounded-full px-5 py-2 text-sm font-bold bg-white text-black border border-gray-300 transition-colors shadow-sm cursor-pointer"
            >
              Edit profile
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <FollowButton user={user} onChange={onFollowChange} />
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMessage}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-100"
              >
                <MessageCircle size={16} /> Message
              </motion.button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="mt-2"
        >
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {user.name}
          </h1>

          <p className="text-sm text-gray-500">@{user.username}</p>

          {user.bio && (
            <p className="mt-3 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
              {user.bio}
            </p>
          )}

          <div className="mt-3 flex gap-5 text-sm">
            <Link href={`/profile/${user.username}/following`} className="cursor-pointer hover:underline">
              <strong className="font-bold text-gray-900">
                {user.following?.length ?? 0}
              </strong>{" "}
              <span className="text-gray-500">Following</span>
            </Link>

            <Link href={`/profile/${user.username}/followers`} className="cursor-pointer hover:underline">
              <strong className="font-bold text-gray-900">
                {user.followers?.length ?? 0}
              </strong>{" "}
              <span className="text-gray-500">Followers</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
