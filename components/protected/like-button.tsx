"use client";
import React from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useLike } from "@/queries/react-query/queris";

import { CommentWithData, PostWithData, ReplyWithData } from "@/type";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Loader } from "../Loader";
import { cn } from "@/lib/utils";
import { QueryKey } from "@tanstack/react-query";

interface LikeButtonProps {
  parent: PostWithData | CommentWithData | ReplyWithData;
  className?: string;
  queryKey:QueryKey
}

const LikeButton = ({ parent, className,queryKey }: LikeButtonProps) => {
  const { user } = useCurrentUser();
  const { mutate: likePost } = useLike(queryKey);
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
      variant={"postCard"}
      className={cn("transition ", className)}
      onClick={() => likePost(parent.id)}
    >
      <Heart fill={parent.isLikedByMe ? "red" : ""} size={18} />
      <span>{parent.likesCount}</span>
    </Button>
  );
};

export default LikeButton;
