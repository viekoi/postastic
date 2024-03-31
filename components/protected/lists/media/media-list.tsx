"use client";

import React, { ReactNode } from "react";

import { MediaWithData } from "@/type";
import CommentCard from "../../cards/comment/comment-card";
import { cn } from "@/lib/utils";
import PostCard from "../../cards/post/post-card";
import ReplyCard from "../../cards/reply/reply-card";
import { MediaTypes } from "@/constansts";

interface MediaListProps {
  medias: MediaWithData[];
  className?: string;
  type: (typeof MediaTypes)[number];
}

const MediaList = ({ medias, className, type }: MediaListProps) => {
  let ListBody: ReactNode[] = [];

  switch (type) {
    case "post":
      ListBody = medias.map((media) => (
        <PostCard post={media} key={media.id} />
      ));
      break;
    case "comment":
      ListBody = medias.map((media) => (
        <CommentCard comment={media} key={media.id} />
      ));
      break;
    case "reply":
      ListBody = medias.map((media) => (
        <ReplyCard reply={media} key={media.id} />
      ));
      break;
    default:
      break;
  }

  return <div className={cn("", className)}>{ListBody}</div>;
};

export default MediaList;
