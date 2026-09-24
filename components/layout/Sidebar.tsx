"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Users } from "lucide-react";
import TweetModal from "@/components/tweet/TweetModal";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Home",
    icon: "/icons/sidebar/notifications-x.svg.svg-4.Woblo.svg",
    href: "/home",
  },
  {
    name: "Explore",
    icon: "/icons/sidebar/8-home-x.svg.svg-5.Woblo (1).svg",
    href: "/explore",
  },
  {
    name: "Notifications",
    icon: "/icons/sidebar/8-home-x.svg.svg-6.Woblo.svg",
    href: "/notifications",
  },
  {
    name: "Messages",
    icon: "",
    href: "/messages",
  },
  {
    name: "People",
    icon: "/icons/sidebar/notifications-x.svg.svg-7.Woblo.svg",
    href: "/people",
  },
  {
    name: "Grok",
    icon: "/icons/sidebar/notifications-x.svg.svg-9.Woblo.svg",
    href: "/grok",
  },
  {
    name: "History",
    icon: "/icons/sidebar/notifications-x.svg.svg-10.Woblo.svg",
    href: "/history",
  },
  {
    name: "Creator Studio",
    icon: "/icons/sidebar/notifications-x.svg.svg-11.Woblo.svg",
    href: "/home",
  },
  {
    name: "Premium",
    icon: "/icons/sidebar/notifications-x.svg.svg-12.Woblo.svg",
    href: "/premium",
  },
];

const moreMenuItems = [
  { name: "Lists", icon: "/icons/sidebar/list/notifications-x.svg.svg-3.Woblo.svg", href: "/lists" },
  { name: "Communities", icon: "/icons/sidebar/list/notifications-x.svg.svg-4.Woblo.svg", href: "/communities" },
  { name: "Business", icon: "/icons/sidebar/list/notifications-x.svg.svg-5.Woblo.svg", href: "/business" },
  { name: "Ads", icon: "/icons/sidebar/list/notifications-x.svg.svg-6.Woblo.svg", href: "/ads" },
  { name: "Create your Space", icon: "/icons/sidebar/list/notifications-x.svg.svg-7.Woblo.svg", href: "/space" },
  { name: "Settings and privacy", icon: "/icons/sidebar/list/notifications-x.svg.svg-8.Woblo.svg", href: "/settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="sticky top-0 hidden h-screen w-[275px] shrink-0 overflow-y-auto px-3 py-2 lg:flex lg:flex-col justify-between">
      <div className="flex flex-col">

        <div className="px-3 py-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link
              href="/home"
              className="flex h-12 w-12 items-center justify-center rounded-full text-3xl font-bold transition-colors hover:bg-gray-100"
            >
              𝕏
            </Link>
          </motion.div>
        </div>

        <nav className="flex flex-col gap-1">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.25,
                delay: index * 0.03,
              }}
            >
              <Link
                href={item.href}
                className={`group flex items-center gap-5 rounded-full px-4 py-3 text-xl transition-colors hover:bg-gray-100 ${pathname === item.href ? "font-bold" : ""}`}
              >
                <motion.span
                  className="flex w-7 items-center justify-center"
                  whileHover={{ scale: 1.15 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                >
                  {item.name === "People" ? <Users size={24} aria-hidden="true" /> : item.name === "Messages" ? <MessageCircle size={24} aria-hidden="true" /> : <img src={item.icon} alt={item.name} className="h-6 w-6" />}
                </motion.span>

                <motion.span
                  whileHover={{ x: 3 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  {item.name}
                </motion.span>
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.25,
              delay: 0.2,
            }}
          >
            <Link
              href={user ? `/profile/${user.username}` : "/home"}
              className="group flex items-center gap-5 rounded-full px-4 py-3 text-xl transition-colors hover:bg-gray-100"
            >
              <motion.span
                className="flex w-7 items-center justify-center"
                whileHover={{ scale: 1.15 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
              >
                <img
                  src="/icons/sidebar/8-home-x.svg.svg-13.Woblo.svg"
                  alt="Profile"
                  className="h-6 w-6"
                />
              </motion.span>

              <motion.span
                whileHover={{ x: 3 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                Profile
              </motion.span>
            </Link>
          </motion.div>

          <div className="relative" ref={moreMenuRef}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className="group flex w-full items-center gap-5 rounded-full px-4 py-3 text-xl transition-colors hover:bg-gray-100 text-left"
            >
              <motion.span
                className="flex w-7 items-center justify-center"
                whileHover={{ scale: 1.15 }}
              >
                <img
                  src="/icons/sidebar/notifications-x.svg.svg-14.Woblo.svg"
                  alt="More"
                  className="h-6 w-6"
                />
              </motion.span>
              <motion.span whileHover={{ x: 3 }} className="text-xl">More</motion.span>
            </motion.button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute bottom-full left-0 mb-2 w-64 origin-bottom-left overflow-hidden rounded-2xl border border-gray-200 bg-white py-2 shadow-xl z-50"
                >
                  {moreMenuItems.map((moreItem) => (
                    <motion.div
                      key={moreItem.name}
                      whileHover={{ backgroundColor: "#f3f4f6", x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={moreItem.href}
                        onClick={() => setIsMoreOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 text-base text-black transition-colors"
                      >
                        <img src={moreItem.icon} alt={moreItem.name} className="h-5 w-5" />
                        <span>{moreItem.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
          onClick={() => setIsTweetModalOpen(true)}
          className="mt-5 w-full rounded-full bg-black py-3.5 text-lg font-bold text-white transition-colors hover:bg-gray-800"
        >
          Post
        </motion.button>

        <div className="relative mt-auto mb-4" ref={profileMenuRef}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-full p-3 text-left transition-colors hover:bg-gray-100"
          >
            <motion.div
              animate={{
                scale: isMenuOpen ? 1.05 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
              }}
              className="h-10 w-10 shrink-0 rounded-full bg-gray-300 bg-cover bg-center"
              style={{ backgroundImage: user?.avatar ? `url("${user.avatar}")` : undefined }}
            />

            <div className="min-w-0">
              <p className="truncate font-bold">
                {user?.name}
              </p>

              <p className="truncate text-gray-500">
                @{user?.username}
              </p>
            </div>

            <motion.span
              animate={{
                rotate: isMenuOpen ? 90 : 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="ml-auto"
            >
              •••
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 8,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.18,
                }}
                className="absolute bottom-full left-0 mb-2 w-56 origin-bottom-left overflow-hidden rounded-2xl border border-gray-200 bg-white py-2 shadow-xl z-50"
              >
                <motion.button
                  whileHover={{
                    backgroundColor: "#f3f4f6",
                    x: 3,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={logout}
                  className="w-full px-4 py-3 text-left font-medium"
                >
                  Log out
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <TweetModal
        open={isTweetModalOpen}
        onClose={() => setIsTweetModalOpen(false)}
        onCreated={() => {
          setIsTweetModalOpen(false);
          window.dispatchEvent(new Event("post-created"));
        }}
      />
    </aside>
  );
}
