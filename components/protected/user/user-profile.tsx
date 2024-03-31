"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import React from "react";
import UserHero from "./user-hero";
import UserBio from "./user-bio";
import UserProfileTab from "../tabs/user-profile-tab";

interface UserProfile {
  user: User | null | undefined;
}

const UserProfile = ({ user }: UserProfile) => {
  const router = useRouter();
  if (!user)
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-y-1">
        Opps!!! something went wrong
        <Button onClick={() => router.refresh()}>Refresh page</Button>
      </div>
    );
  return (
    <div>
      <div className="flex flex-col gap-y-20">
        <UserHero user={user} />
        <UserBio user={user} />
      </div>
      <UserProfileTab />
    </div>
  );
};

export default UserProfile;
