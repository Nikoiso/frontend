"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";
import type { User } from "@/types/user";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/errorMessage";

export default function EditProfileModal({
  open,
  onClose,
  user,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  user: User;
  onUpdated: (user: User) => void;
}) {
  const { updateUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const previewUrls = useRef(new Set<string>());
  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const selectImage = (kind: "avatar" | "cover", file: File | null) => {
    const oldUrl = kind === "avatar" ? avatarPreview : coverPreview;
    if (oldUrl) { URL.revokeObjectURL(oldUrl); previewUrls.current.delete(oldUrl); }
    const url = file ? URL.createObjectURL(file) : "";
    if (url) previewUrls.current.add(url);
    if (kind === "avatar") { setAvatar(file); setAvatarPreview(url); }
    else { setCover(file); setCoverPreview(url); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("name", name);
      data.append("username", username);
      data.append("bio", bio);
      if (avatar) data.append("avatar", avatar);
      if (cover) data.append("cover", cover);
      const { data: updated } = await api.put("/users/profile", data);
      const savedUser = updated.user as User;

      updateUser(savedUser);
      onUpdated(savedUser);
      onClose();
    } catch (error) {
      console.error(error);
      setError(getApiErrorMessage(error, "Could not save your profile. Check your images and try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white rounded-2xl overflow-hidden w-full max-w-lg mx-auto shadow-2xl"
      >
        <form onSubmit={save} className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full transition-colors text-gray-700"
              >
                ✕
              </motion.button>
              <h2 className="text-xl font-extrabold text-black">Edit profile</h2>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-black px-5 py-2 font-bold text-sm text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </motion.button>
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-all">
            <label className="block text-xs font-medium text-gray-500">Username</label>
            <input value={username} onChange={(event) => setUsername(event.target.value)} maxLength={15} className="w-full bg-transparent outline-none text-gray-900 text-sm mt-0.5" />
          </div>

          <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-all">
            <label className="block text-xs font-medium text-gray-500">
              Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={50}
              className="w-full bg-transparent outline-none text-gray-900 text-sm mt-0.5"
            />
          </div>

          <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-all">
            <label className="block text-xs font-medium text-gray-500">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={160}
              rows={3}
              className="w-full bg-transparent outline-none text-gray-900 text-sm mt-0.5 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
            <label className="text-xs font-semibold text-gray-700">
              Avatar Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => { const file = event.target.files?.[0] ?? null; if (file && !file.type.startsWith("image/")) { setError("Choose an image file."); return; } if (file && file.size > 5 * 1024 * 1024) { setError("Images must be 5 MB or smaller."); return; } setError(""); selectImage("avatar", file); }}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
            />
          </div>
          {avatarPreview && <img src={avatarPreview} alt="Profile image preview" className="h-16 w-16 rounded-full object-cover" />}

          <div className="flex flex-col gap-1 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
            <label className="text-xs font-semibold text-gray-700">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => { const file = event.target.files?.[0] ?? null; if (file && !file.type.startsWith("image/")) { setError("Choose an image file."); return; } if (file && file.size > 5 * 1024 * 1024) { setError("Images must be 5 MB or smaller."); return; } setError(""); selectImage("cover", file); }}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
            />
          </div>
          {coverPreview && <img src={coverPreview} alt="Banner preview" className="h-24 w-full rounded-xl object-cover" />}
        </form>
      </motion.div>
    </Modal>
  );
}
