"use client";

import React from "react";

import PostCard from "./cards/post-card";
import { CommentWithData } from "@/type";
import CommentCard from "./cards/comment-card";

interface CommentListProps {
  comments: CommentWithData[];
}

const CommentList = ({ comments }: CommentListProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      {comments.map((comment) => {
        return <CommentCard comment={comment} key={comment.id} />;
      })}
    </div>
  );
};

export default CommentList;
