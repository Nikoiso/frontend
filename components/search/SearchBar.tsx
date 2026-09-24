"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!value.trim()) return;

    router.push(
      `/explore?q=${encodeURIComponent(value)}`
    );
  };

  return (
    <form onSubmit={submit} className="w-full">
      <motion.div 
        whileTap={{ scale: 0.99 }}
        className="flex h-[44px] items-center rounded-full bg-gray-100 px-4 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-[#1d9bf0] focus-within:border-[#1d9bf0] border border-transparent"
      >
        <span className="mr-3 text-gray-500 text-lg">⌕</span>

        <input
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          placeholder="Search"
          className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
        />
      </motion.div>
    </form>
  );
}