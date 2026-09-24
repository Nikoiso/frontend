// "use client";

// import MainLayout from "@/components/layout/MainLayout";
// import TweetComposer from "@/components/tweet/TweetComposer";
// import TweetCard from "@/components/tweet/TweetCard";
// import Loader from "@/components/ui/Loader";
// import EmptyState from "@/components/ui/EmptyState";
// import { useState } from "react";
// import { useTweets } from "@/hooks/useTweets";
// import api from "@/lib/api";

// export default function HomePage() {
//   const {
//     tweets,
//     loading,
//     refreshTweets,
//   } = useTweets();
//   const [feed, setFeed] = useState<"all" | "following">("all");
//   const [feedTweets, setFeedTweets] = useState(tweets);

//   const selectFeed = async (nextFeed: "all" | "following") => {
//     setFeed(nextFeed);
//     if (nextFeed === "all") {
//       await refreshTweets();
//       return;
//     }
//     try {
//       const { data } = await api.get("/posts/following");
//       setFeedTweets(data.posts);
//     } catch (error) {
//       console.error("Unable to load following feed", error);
//     }
//   };

//   const displayedTweets = feed === "following" ? feedTweets : tweets;

//   const handleLike = async (id: string) => {
//     try {
//       await api.post(`/posts/${id}/like`);
//       refreshTweets();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleRepost = async (id: string) => {
//     try {
//       await api.post(`/posts/${id}/repost`);
//       refreshTweets();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <MainLayout>
//       <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
//         <div className="flex h-[53px]">
//           <button onClick={() => void selectFeed("all")} className="relative flex-1 font-bold">
//             For you

//             <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[#1d9bf0]" />
//           </button>

//           <button onClick={() => void selectFeed("following")} className={feed === "following" ? "flex-1 font-bold" : "flex-1 text-gray-500"}>
//             Following
//           </button>
//         </div>
//       </header>

//       <TweetComposer onCreated={refreshTweets} />

//       {loading ? (
//         <Loader />
//       ) : displayedTweets.length === 0 ? (
//         <EmptyState
//           title="No posts yet"
//           description="Be the first person to post something."
//         />
//       ) : (
//         displayedTweets.map((tweet) => (
//           <TweetCard
//             key={tweet._id}
//             tweet={tweet}
//             onLike={() => handleLike(tweet._id)}
//             onRepost={() =>
//               handleRepost(tweet._id)
//             }
//           />
//         ))
//       )}
//     </MainLayout>
//   );
// }



"use client";

import MainLayout from "@/components/layout/MainLayout";
import TweetComposer from "@/components/tweet/TweetComposer";
import TweetCard from "@/components/tweet/TweetCard";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import { useEffect, useState } from "react";
import { useTweets } from "@/hooks/useTweets";
import api from "@/lib/api";
import { motion } from "framer-motion";

export default function HomePage() {
  const {
    tweets,
    loading,
    refreshTweets,
  } = useTweets();
  const [feed, setFeed] = useState<"all" | "following">("all");
  const [feedTweets, setFeedTweets] = useState(tweets);

  useEffect(() => {
    const handlePostCreated = () => { void refreshTweets(); };
    window.addEventListener("post-created", handlePostCreated);
    return () => window.removeEventListener("post-created", handlePostCreated);
  }, [refreshTweets]);

  const selectFeed = async (nextFeed: "all" | "following") => {
    setFeed(nextFeed);
    if (nextFeed === "all") {
      await refreshTweets();
      return;
    }
    try {
      const { data } = await api.get("/posts/following");
      setFeedTweets(data.posts);
    } catch (error) {
      console.error("Unable to load following feed", error);
    }
  };

  const displayedTweets = feed === "following" ? feedTweets : tweets;

  const handleLike = async (id: string) => {
    try {
      await api.post(`/posts/${id}/like`);
      refreshTweets();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRepost = async (id: string) => {
    try {
      await api.post(`/posts/${id}/repost`);
      refreshTweets();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      {/* Twitter-სტილის მინისებრი ჰედერი ტაბებით */}
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex h-[53px]">
          {/* "For you" Tab */}
          <button 
            onClick={() => void selectFeed("all")} 
            className="relative flex-1 font-bold text-sm text-center transition-colors hover:bg-gray-50 flex items-center justify-center cursor-pointer"
          >
            <span className={feed === "all" ? "text-gray-900" : "text-gray-500"}>
              For you
            </span>

            {feed === "all" && (
              <motion.div
                layoutId="homeActiveTab"
                className="absolute bottom-0 h-1 w-16 bg-[#1d9bf0] rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>

          {/* "Following" Tab */}
          <button 
            onClick={() => void selectFeed("following")} 
            className="relative flex-1 font-bold text-sm text-center transition-colors hover:bg-gray-50 flex items-center justify-center cursor-pointer"
          >
            <span className={feed === "following" ? "text-gray-900" : "text-gray-500"}>
              Following
            </span>

            {feed === "following" && (
              <motion.div
                layoutId="homeActiveTab"
                className="absolute bottom-0 h-1 w-16 bg-[#1d9bf0] rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        </div>
      </header>

      {/* Tweet Composer (პოსტის დასაწერი ველი) */}
      <TweetComposer onCreated={refreshTweets} />

      {/* პოსტების ლისტი ან ლოუდერი */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : displayedTweets.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Be the first person to post something."
        />
      ) : (
        <div className="divide-y divide-gray-100">
          {displayedTweets.map((tweet, index) => (
            <motion.div
              key={tweet._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <TweetCard
                tweet={tweet}
                onLike={() => handleLike(tweet._id)}
                onRepost={() => handleRepost(tweet._id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
