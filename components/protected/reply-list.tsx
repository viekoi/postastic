"use client";

import React from "react";
import { ReplyWithData } from "@/type";
import ReplyCard from "./cards/reply-card";

interface ReplyListProps {
  replies: ReplyWithData[];
}

const ReplyList = ({ replies }: ReplyListProps) => {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      {replies.map((reply) => {
        return (
         <ReplyCard key={reply.id} reply={reply}/>
        );
      })}
    </div>
  );
};

export default ReplyList;
