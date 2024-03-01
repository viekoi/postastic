"use client";
import React, { startTransition, useOptimistic } from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useLikePost } from "@/queries/react-query/queris";

import { PostWithData } from "@/type";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Loader } from "../Loader";

interface LikeButtonProps {
  post: PostWithData;
  currentPage: number;
}

const LikeButton = ({ post, currentPage }: LikeButtonProps) => {
  const { user } = useCurrentUser();
  const { mutate: likePost } = useLikePost();
  if (!user)
    return (
      <Button
        disabled
        variant={"ghost"}
        className="col-span-1 space-x-2 transition"
      >
        <Loader size={18} />
      </Button>
    );

  return (
    <Button
      variant={"ghost"}
      className="col-span-1 space-x-2 transition"
      onClick={() => likePost({ likedPost: post, currentPage })}
    >
      <Heart fill={post.isLikedByUser ? "red" : ""} size={18} />
      <span>{post.likesCount}</span>
    </Button>
  );
};

export default LikeButton;
