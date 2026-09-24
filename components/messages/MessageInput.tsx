"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onSend: (text: string) => void;
}

export default function MessageInput({
  onSend,
}: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;

    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex items-center gap-3 border-t border-gray-100 bg-white px-4 py-3">
      <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-[#1d9bf0] focus-within:border-[#1d9bf0] border border-transparent">
        <input
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit();
            }
          }}
          placeholder="Start a new message"
          className="w-full bg-transparent outline-none placeholder:text-gray-500 text-sm text-gray-900"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={submit}
        disabled={!text.trim()}
        className={`rounded-full bg-[#1d9bf0] px-5 py-2.5 font-bold text-sm text-white transition-colors ${
          !text.trim() ? "opacity-50 cursor-not-allowed hover:bg-[#1d9bf0]" : "hover:bg-[#1a8cd8]"
        }`}
      >
        Send
      </motion.button>
    </div>
  );
}