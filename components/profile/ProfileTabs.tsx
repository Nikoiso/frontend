"use client";

import { motion } from "framer-motion";

const tabs = [
  "Posts",
  "Replies",
  "Likes",
];

interface Props {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function ProfileTabs({ activeTab = "Posts", onTabChange }: Props) {
  const handleTabClick = (tab: string) => {
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="flex border-b border-gray-100 w-full overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className="relative flex-1 min-w-[90px] py-4 text-center font-bold text-sm transition-colors hover:bg-gray-50 group cursor-pointer"
          >
            <span className={`transition-colors ${isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}>
              {tab}
            </span>

            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full mx-auto w-12"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
