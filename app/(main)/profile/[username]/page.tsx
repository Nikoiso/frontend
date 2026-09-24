"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

import Loader from "@/components/ui/Loader";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import TweetCard from "@/components/tweet/TweetCard";
import EditProfileModal from "@/components/profile/EditProfileModal";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";

import { User } from "@/types/user";
import { Tweet } from "@/types/tweet";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: currentUser } = useAuth();
  const { refreshUser } = useAuth();
  const params = useParams();
  const router = useRouter();

  const username = params.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");
  const [messageError, setMessageError] = useState("");

  const openConversation = async () => {
    if (!user || currentUser?._id === user._id) return;
    try {
      const { data } = await api.post(`/messages/conversation/${user._id}`);
      router.push(`/messages?conversation=${data._id}`);
    } catch (error) {
      console.error("Unable to open conversation", error);
      setMessageError("Unable to open this conversation. Please try again.");
    }
  };

  const refreshProfile = (updatedUser: User) => {
    setUser(updatedUser);
    if (currentUser?._id === updatedUser._id) void refreshUser();
    if (updatedUser.username !== username) router.replace(`/profile/${updatedUser.username}`);
  };

  const updateFollowCounts = (following: boolean) => {
    if (!user || !currentUser) return;
    setUser((current) => current ? {
      ...current,
      followers: following
        ? [...current.followers, currentUser._id]
        : current.followers.filter((follower) => (typeof follower === "string" ? follower : follower._id) !== currentUser._id),
    } : current);
  };

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const userResponse = await api.get<User>(`/users/${encodeURIComponent(username)}`);
        const foundUser = userResponse.data;

        setUser(foundUser);
        if (!foundUser) return;

      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const tab = activeTab.toLowerCase();
    api.get(`/posts/user/${user._id}`, { params: { tab: tab === "posts" ? undefined : tab } })
      .then(({ data }) => { if (active) setTweets(data.posts ?? data); })
      .catch((error) => console.error("Unable to load profile posts", error));
    return () => { active = false; };
  }, [activeTab, user]);

  if (loading) {
    return <MainLayout><Loader /></MainLayout>;
  }

  if (!user) {
    return (
      <MainLayout><div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            User not found
          </h1>

          <p className="mt-2 text-gray-500">
            This profile does not exist.
          </p>
        </div>
      </div></MainLayout>
    );
  }

  return (
    <MainLayout><div>
      <ProfileHeader user={user} isOwnProfile={currentUser?._id === user._id} onEdit={() => setEditing(true)} onMessage={() => void openConversation()} onFollowChange={updateFollowCounts} />
      {messageError && <p role="alert" className="px-4 py-2 text-sm text-red-600">{messageError}</p>}
      <EditProfileModal key={`${user._id}-${user.name}-${user.username}-${user.bio}-${user.avatar}-${user.coverImage}`} open={editing} onClose={() => setEditing(false)} user={user} onUpdated={refreshProfile} />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div>
        {tweets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-xl font-bold">
              No posts yet
            </h2>

            <p className="mt-2 text-gray-500">
              {user.name} hasn&apos;t posted anything yet.
            </p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
            />
          ))
        )}
      </div>
    </div></MainLayout>
  );
}
