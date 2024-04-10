"use client";
import React from "react";
import { Button } from "../ui/button";

import { useFollow } from "@/queries/react-query/queris";

import { SessionUser, UserWithData } from "@/type";

import { Loader } from "../Loader";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  user: UserWithData;
  currentUser: SessionUser;
  className?: string;
}

const FollowButton = ({ user, className, currentUser }: FollowButtonProps) => {
  const { mutate: followUser } = useFollow(
    currentUser ? currentUser.id : "",
    user.id,
    user.isFollowedByMe ? "unfollow" : "follow"
  );
  if (!user)
    return (
      <Button
        disabled
        variant={"postCard"}
        className={cn("transition ", className)}
      >
        <Loader size={18} />
      </Button>
    );

  return (
    <Button
      variant={"default"}
      className={cn("transition ", className)}
      onClick={() => followUser(user.id)}
    >
      {user.isFollowedByMe ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
