"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import TweetCard from "@/components/tweet/TweetCard";
import ReplyCard from "@/components/tweet/ReplyCard";
import Loader from "@/components/ui/Loader";

import api from "@/lib/api";
import { Tweet } from "@/types/tweet";

export default function PostPage() {
  const params = useParams();

  const id = params.id as string;

  const [tweet, setTweet] =
    useState<Tweet | null>(null);

  const [replies, setReplies] =
    useState<Tweet[]>([]);

  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const submitReply = async () => {
    if (!replyText.trim() || sendingReply) return;
    try {
      setSendingReply(true);
      const { data } = await api.post("/posts", { text: replyText.trim(), parentPost: id });
      setReplies((current) => [...current, data]);
      setReplyText("");
    } catch (error) { console.error("Unable to post reply", error); }
    finally { setSendingReply(false); }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [postResponse, repliesResponse] =
          await Promise.all([
            api.get(`/posts/${id}`),
            api.get(`/posts/${id}/replies`),
          ]);

        setTweet(postResponse.data);
        setReplies(repliesResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <MainLayout>
      <header className="flex h-[53px] items-center border-b border-gray-200 px-4">
        <button className="mr-6">←</button>

        <h1 className="font-bold">Post</h1>
      </header>

      {loading ? (
        <Loader />
      ) : tweet ? (
        <>
          <TweetCard tweet={tweet} />

          <div className="border-b border-gray-200 px-4 py-4">
            <textarea
              placeholder="Post your reply"
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              className="w-full resize-none outline-none"
              rows={3}
            />

            <div className="flex justify-end">
              <button disabled={!replyText.trim() || sendingReply} onClick={() => void submitReply()} className="rounded-full bg-[#1d9bf0] px-5 py-2 font-bold text-white disabled:opacity-50">
                {sendingReply ? "Replying..." : "Reply"}
              </button>
            </div>
          </div>

          {replies.map((reply) => (
            <ReplyCard
              key={reply._id}
              tweet={reply}
            />
          ))}
        </>
      ) : (
        <p className="p-5">Post not found.</p>
      )}
    </MainLayout>
  );
}
