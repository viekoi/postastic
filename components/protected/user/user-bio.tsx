"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserWithData } from "@/type";

import { useRouter } from "next/navigation";
import React from "react";

interface UserBiopProps {
  user:UserWithData ;
}

const UserBio = ({ user }: UserBiopProps) => {
  const { user: currentUser, isLoading } = useCurrentUser();
  const router = useRouter();
  return (
    <div className="border-b-[0.5px] border-gray-600 pb-4 px-4">
      <div className="flex items-center w-full justify-between">
        <p className="text-2xl font-semibold">{user.name}</p>
        <div>
          {currentUser?.id === user.id && (
            <Button onClick={() => router.push(`/settings?tab=profile`)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      <div className="flex gap-x-2">
        <div className="font-semibold text-sm text-gray-600">
          Followers: {user.followerCounts}
        </div>
        <div className="font-semibold text-sm text-gray-600">
          Following: {user.followingCounts}
        </div>
      </div>
    </div>
  );
};

export default UserBio;
