"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "../ui/Avatar";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Image, Smile, Calendar, MapPin, BarChart2, X } from "lucide-react";
import { motion } from "framer-motion";
import { getApiErrorMessage } from "@/lib/errorMessage";

export default function TweetComposer({
  onCreated,
  autoFocus = false,
}: {
  onCreated?: () => void;
  autoFocus?: boolean;
}) {
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const previewRef = useRef("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); };
  }, []);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const updateImages = (files: File[]) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = files[0] ? URL.createObjectURL(files[0]) : "";
    setPreview(previewRef.current);
    setImages(files);
  };

  const handleSubmit = async () => {
    if (!text.trim() && images.length === 0) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("text", text);

      if (images[0]) formData.append("image", images[0]);

      await api.post("/posts", formData);

      setText("");
      updateImages([]);

      onCreated?.();
    } catch (error) {
      console.error(error);
      setError(getApiErrorMessage(error, "Your post could not be published. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    updateImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="border-b border-gray-100 px-4 py-3 bg-white">
      <div className="flex gap-3">
        <div className="shrink-0 pt-0.5">
          <Avatar src={user?.avatar} />
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What is happening?!"
            data-tweet-composer
            rows={3}
            maxLength={280}
            className="w-full resize-none border-none bg-transparent pt-1 text-lg outline-none placeholder:text-gray-500 text-gray-900 leading-normal"
          />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          {images.length > 0 && (
            <div className="mb-3 relative grid grid-cols-1 gap-2 overflow-hidden rounded-2xl">
              {images.map((image, index) => (
                <div key={index} className="relative group max-h-[300px] overflow-hidden rounded-2xl bg-gray-100 border border-gray-100">
                  <img
                    src={preview}
                    alt="Upload preview"
                    className="w-full h-full object-cover max-h-[300px]"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-3 left-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
            <div className="flex items-center gap-1 text-[#1d9bf0]">
              <label className="cursor-pointer p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                <Image size={20} aria-hidden="true" />
                <input
                  type="file"
                  aria-label="Choose an image"
                  accept="image/*"
                  hidden
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (selected && !selected.type.startsWith("image/")) { setError("Choose an image file."); event.target.value = ""; return; }
                    if (selected && selected.size > 5 * 1024 * 1024) { setError("Images must be 5 MB or smaller."); event.target.value = ""; return; }
                    setError("");
                    const files = Array.from(event.target.files || []).slice(0, 1);
                    updateImages(files);
                  }}
                />
              </label>

              <button type="button" className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                <span className="text-[10px] font-extrabold border border-[#1d9bf0] px-1 rounded">GIF</span>
              </button>

              <button type="button" className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                <BarChart2 size={20} />
              </button>

              <button type="button" className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                <Smile size={20} />
              </button>

              <button type="button" className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                <Calendar size={20} />
              </button>

              <button type="button" className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors">
                <MapPin size={20} />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading || (!text.trim() && images.length === 0)}
              onClick={handleSubmit}
              className="rounded-full bg-[#1d9bf0] px-5 py-2 font-bold text-sm text-white transition-colors hover:bg-[#1a8cd8] disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? "Posting..." : "Post"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
