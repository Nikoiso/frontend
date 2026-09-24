"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "plus">("premium");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between relative selection:bg-[#1d9bf0] selection:text-white">
      <div className="p-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/home" className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
          <X size={24} />
        </Link>
        <div className="text-xl font-bold">𝕏</div>
        <div className="w-10"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">✨</div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Don’t lose <span className="text-[#1d9bf0]">50% off</span> your first 2 months
          </h2>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-gray-900 p-1 rounded-full border border-gray-800 flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-white text-black shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                billingCycle === "annual" ? "bg-white text-black shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10 w-full">
          <div
            onClick={() => setSelectedPlan("premium")}
            className={`cursor-pointer rounded-2xl p-6 border transition-all bg-gray-950 flex flex-col justify-between ${
              selectedPlan === "premium" ? "border-[#1d9bf0] ring-1 ring-[#1d9bf0]" : "border-gray-800 hover:border-gray-700"
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Premium</h3>
                <span className="text-xs font-bold text-[#1d9bf0] bg-[#1d9bf0]/10 px-2.5 py-1 rounded-full">
                  50% off for 2 months
                </span>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold">$2.50</span>
                <span className="text-gray-400 text-sm"> / month</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Verified checkmark</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Enhanced Grok access</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Advanced analytics</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Less ads in your feeds</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Boosted replies</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Write Articles</li>
              </ul>
            </div>
          </div>

          <div
            onClick={() => setSelectedPlan("plus")}
            className={`cursor-pointer rounded-2xl p-6 border transition-all bg-gray-950 flex flex-col justify-between ${
              selectedPlan === "plus" ? "border-[#1d9bf0] ring-1 ring-[#1d9bf0]" : "border-gray-800 hover:border-gray-700"
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Premium+</h3>
                <span className="text-xs font-bold text-[#1d9bf0] bg-[#1d9bf0]/10 px-2.5 py-1 rounded-full">
                  50% off for 2 months
                </span>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold">$20</span>
                <span className="text-gray-400 text-sm"> / month</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Fully ad-free</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> SuperGrok NEW</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Handle Marketplace NEW</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#1d9bf0]" /> Highest reply boost</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-black/80 backdrop-blur-md border-t border-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg">
              {selectedPlan === "premium" ? "Premium" : "Premium+"} — <span className="text-[#1d9bf0]">$2.50</span> <span className="text-xs text-gray-400">/ month</span>
            </p>
            <p className="text-xs text-gray-400">For first 2 months, then $5 billed monthly</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert("Redirecting to checkout...")}
            className="w-full md:w-auto px-8 py-3 rounded-full bg-white text-black font-extrabold hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Subscribe & Pay
          </motion.button>
        </div>
      </div>
    </div>
  );
}