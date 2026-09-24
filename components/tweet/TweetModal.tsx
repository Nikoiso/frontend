"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Modal from "../ui/Modal";
import TweetComposer from "./TweetComposer";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function TweetModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <Modal open={open} onClose={onClose}>
      <div className="overflow-hidden rounded-2xl bg-white">
        <header className="flex items-center justify-between px-3 pt-2">
          <button type="button" onClick={onClose} aria-label="Close post composer" className="rounded-full p-2 text-gray-800 transition-colors hover:bg-gray-100">
            <X size={20} />
          </button>
          <span className="px-3 py-2 text-sm font-semibold text-[#1d9bf0]">Drafts</span>
        </header>
        <TweetComposer autoFocus onCreated={onCreated} />
      </div>
    </Modal>,
    document.body,
  );
}
