"use client";
import { Button } from "@/components/ui/button";

import React from "react";
import UserHero from "./user-hero";
import UserBio from "./user-bio";
import UserProfileTab from "../tabs/user-profile-tab";
import { getUserById } from "@/queries/react-query/queris";
import { Loader } from "@/components/Loader";

interface UserProfileProps {
  id: string;
}

const UserProfile = ({ id }: UserProfileProps) => {
  const {
    data: user,
    error,
    refetch,
    isRefetching,
    isPending,
  } = getUserById(id);

  if (isPending || isRefetching)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader />
      </div>
    );

  if (error || !user)
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-y-1">
        Opps!!! something went wrong
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  return (
    <div className="h-full">
      <div className="flex flex-col gap-y-20">
        <UserHero user={user} />
        <UserBio user={user} />
      </div>
      <UserProfileTab user={user} />
    </div>
  );
};

export default UserProfile;
