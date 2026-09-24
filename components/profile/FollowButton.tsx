"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import type { UserSummary } from "@/types/user";
import { motion, AnimatePresence } from "framer-motion";

interface FollowButtonProps {
  user: UserSummary;
  onChange?: (following: boolean) => void;
}

export default function FollowButton({ user, onChange }: FollowButtonProps) {
  const { user: currentUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState("");

  const isFollowing =
    currentUser?.following?.some((entry) => (typeof entry === "string" ? entry : entry._id) === user._id) ?? false;

  const handleFollow = async () => {
    if (!currentUser || currentUser._id === user._id || loading) return;

    try {
      setLoading(true);
      setError("");

      const nextFollowing = !isFollowing;
      if (isFollowing) {
        await api.delete(`/users/${user._id}/follow`);
      } else {
        await api.post(`/users/${user._id}/follow`);
      }

      await refreshUser();
      onChange?.(nextFollowing);
    } catch (error) {
      console.error("Follow error:", error);
      setError("Could not update follow. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser._id === user._id) {
    return null;
  }

  return (
    <div className="flex flex-col items-end gap-1">
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleFollow}
      disabled={loading}
      className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-200 min-w-[100px] flex items-center justify-center ${
        isFollowing
          ? isHovered
            ? "border border-red-300 bg-red-50 text-red-600"
            : "border border-gray-300 bg-white text-black hover:border-red-300"
          : "bg-black text-white hover:bg-gray-800 shadow-sm"
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={loading ? "loading" : isFollowing ? (isHovered ? "unfollow" : "following") : "follow"}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.15 }}
        >
          {loading ? "Loading..." : isFollowing ? (isHovered ? "Unfollow" : "Following") : "Follow"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
    {error && <span role="alert" className="max-w-36 text-right text-xs text-red-600">{error}</span>}
    </div>
  );
}
