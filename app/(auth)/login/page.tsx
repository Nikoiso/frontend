"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import type { AuthResponse } from "@/types/user";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
      setToken(data.token);
      router.replace("/home");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-[380px] py-6"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="text-4xl font-extrabold text-black cursor-pointer"
          >
            𝕏
          </motion.div>
        </div>

        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-gray-900 text-center">
          Sign in to X
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative border border-gray-300 rounded-md px-3 py-2.5 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-all">
            <label className="block text-xs font-medium text-gray-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 text-sm mt-0.5"
            />
          </div>

          <div className="relative border border-gray-300 rounded-md px-3 py-2.5 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-all">
            <label className="block text-xs font-medium text-gray-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 text-sm mt-0.5"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                role="alert"
                className="text-sm text-red-500 font-medium text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-[#1d9bf0] hover:underline">
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="h-12 w-full rounded-full bg-black font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 text-base"
          >
            {loading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#1d9bf0] hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </main>
  );
}