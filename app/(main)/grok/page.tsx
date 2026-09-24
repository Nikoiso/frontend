"use client";

import { FormEvent, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import api from "@/lib/api";
import { motion } from "framer-motion";

export default function GrokPage() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = async (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true); setError(""); setAnswer("");
    try { const { data } = await api.post("/grok", { prompt: prompt.trim() }); setAnswer(data.answer); }
    catch (err) { console.error("Grok request failed", err); setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Grok could not respond. Please try again."); }
    finally { setLoading(false); }
  };
  return <MainLayout><header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur"><h1 className="text-xl font-bold">Grok</h1></header><section className="p-4"><p className="mb-4 text-sm text-gray-500">Ask Grok a question.</p><form onSubmit={ask} className="flex flex-col gap-3"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={8000} rows={4} placeholder="Ask anything" className="w-full resize-y rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:border-[#1d9bf0]"/><motion.button whileTap={{ scale: 0.98 }} disabled={!prompt.trim() || loading} className="self-end rounded-full bg-black px-5 py-2 font-bold text-white disabled:opacity-50">{loading ? "Thinking..." : "Ask Grok"}</motion.button></form>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{answer && <article className="mt-5 whitespace-pre-wrap rounded-2xl border border-gray-200 p-4 text-[15px] leading-relaxed text-gray-900">{answer}</article>}</section></MainLayout>;
}
