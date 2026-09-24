"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function MobileNav() {
  const { user } = useAuth();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-gray-200 bg-white lg:hidden">
      <Link href="/home" className="text-xl">
        ⌂
      </Link>

      <Link href="/explore" className="text-xl">
        ⌕
      </Link>

      <Link href="/notifications" className="text-xl">
        ♧
      </Link>

      <Link href="/messages" className="text-xl">
        ✉
      </Link>

      <Link href={user ? `/profile/${user.username}` : "/login"} className="text-xl">
        ♙
      </Link>
    </nav>
  );
}
