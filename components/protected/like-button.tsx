"use client";
import React from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useLikePost } from "@/queries/react-query/queris";

import { PostWithData } from "@/type";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Loader } from "../Loader";

interface LikeButtonProps {
  post: PostWithData;
}

const LikeButton = ({ post }: LikeButtonProps) => {
  const { user } = useCurrentUser();

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
  const { id: postId, likes } = post;

  const isLikeByMe = likes.some((like) => like.userId === user.id);

  const { mutate: likePost, isPending } = useLikePost();
  return (
    <Button
      disabled={isPending}
      variant={"ghost"}
      className="col-span-1 space-x-2 transition"
      onClick={() => likePost({ postId })}
    >
      <Heart fill={isLikeByMe ? "red" : ""} size={18} />
      <span>{likes.length}</span>
    </Button>
  );
};

export default LikeButton;
