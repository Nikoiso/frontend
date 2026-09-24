// "use client";

// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useState } from "react";
// import api from "@/lib/api";

// function ResetPasswordForm() {
//   const token = useSearchParams().get("token");
//   const router = useRouter();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!token || password !== confirmPassword) { setError(token ? "Passwords do not match." : "This reset link is invalid."); return; }
//     setError(""); setLoading(true);
//     try { await api.post(`/auth/reset-password/${token}`, { password }); router.replace("/login"); }
//     catch { setError("This reset link is invalid or has expired."); }
//     finally { setLoading(false); }
//   };

//   return <main className="flex min-h-screen items-center justify-center px-4"><div className="w-full max-w-[400px]"><div className="mb-8 text-center text-5xl font-bold">𝕏</div><h1 className="mb-6 text-3xl font-bold">Choose a new password</h1><form onSubmit={submit} className="space-y-4"><input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="h-14 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-[#1d9bf0]" /><input type="password" required minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" className="h-14 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-[#1d9bf0]" />{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button disabled={loading || !token} className="h-12 w-full rounded-full bg-black font-bold text-white disabled:opacity-50">{loading ? "Updating..." : "Update password"}</button></form><p className="mt-6 text-center text-gray-500"><Link href="/login" className="text-[#1d9bf0] hover:underline">Back to sign in</Link></p></div></main>;
// }

// export default function ResetPasswordPage() {
//   return <Suspense fallback={<main className="flex min-h-screen items-center justify-center">Loading…</main>}><ResetPasswordForm /></Suspense>;
// }



"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || password !== confirmPassword) { 
      setError(token ? "Passwords do not match." : "This reset link is invalid."); 
      return; 
    }
    setError(""); 
    setLoading(true);
    try { 
      await api.post(`/auth/reset-password/${token}`, { password }); 
      router.replace("/login"); 
    }
    catch { 
      setError("This reset link is invalid or has expired."); 
    }
    finally { 
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
        {/* X Logo */}
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
          Choose a new password
        </h1>

        <form onSubmit={submit} className="space-y-4">
          {/* New Password Input */}
          <div className="relative border border-gray-300 rounded-md px-3 py-2.5 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-all">
            <label className="block text-xs font-medium text-gray-500">
              New password
            </label>
            <input 
              type="password" 
              required 
              minLength={6} 
              value={password} 
              onChange={(event) => setPassword(event.target.value)} 
              className="w-full bg-transparent outline-none text-gray-900 text-sm mt-0.5" 
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative border border-gray-300 rounded-md px-3 py-2.5 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-all">
            <label className="block text-xs font-medium text-gray-500">
              Confirm new password
            </label>
            <input 
              type="password" 
              required 
              minLength={6} 
              value={confirmPassword} 
              onChange={(event) => setConfirmPassword(event.target.value)} 
              className="w-full bg-transparent outline-none text-gray-900 text-sm mt-0.5" 
            />
          </div>

          {/* Error Message with AnimatePresence */}
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

          {/* Submit Button */}
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !token} 
            className="h-12 w-full rounded-full bg-black font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 text-base mt-2"
          >
            {loading ? "Updating..." : "Update password"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link href="/login" className="text-[#1d9bf0] hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-white">Loading…</main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}