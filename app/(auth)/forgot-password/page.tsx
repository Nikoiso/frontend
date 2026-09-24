"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (requestError: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(responseMessage || "Could not send the reset email. Check the email settings and try again.");
    } finally {
      setLoading(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center px-4"><div className="w-full max-w-[400px]"><div className="mb-8 text-center text-5xl font-bold">𝕏</div><h1 className="mb-2 text-3xl font-bold">Reset your password</h1><p className="mb-6 text-gray-500">Enter your email and we&apos;ll send a reset link.</p><form onSubmit={submit} className="space-y-4"><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="h-14 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-[#1d9bf0]" />{message && <p role="status" className="text-sm text-green-700">{message}</p>}{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button type="submit" disabled={loading} className="h-12 w-full rounded-full bg-black font-bold text-white disabled:opacity-50">{loading ? "Sending..." : "Send reset link"}</button></form><p className="mt-6 text-center text-gray-500"><Link href="/login" className="text-[#1d9bf0] hover:underline">Back to sign in</Link></p></div></main>;
}
