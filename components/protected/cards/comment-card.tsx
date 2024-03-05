"use client";
import React, { useState } from "react";
import {
  Card,
} from "@/components/ui/card";
import { CommentWithData } from "@/type";
import UserAvatar from "../user-avatar";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeButton from "../like-button";

import MediaDisplayer from "../media-displayer";

import { QUERY_KEYS } from "@/queries/react-query/query-keys";

interface CommentCardProps {
  comment: CommentWithData;
  className?: string;
  isModalContent?: boolean;
}

const CommentCard = ({ comment, className }: CommentCardProps) => {
  const [expandConent, setExpandContent] = useState(false);
  const baseContainerClassName = "border border-gray-600 ";
  const indexContainerClassName = (index: number, dataLength: number) => {
    var className = "";
    if (dataLength % 2 === 0) {
      className = "grow-0 basis-[50%] max-w-[50%] ";
    }
    if (dataLength === 1) {
      className = "grow-0 basis-[100%] max-w-[100%] ";
    }

    if (dataLength === 3) {
      className = "grow-0 basis-[33%] max-w-[33%] ";
    }

    if (dataLength === 5) {
      if (index <= 2) {
        className = "grow-0 basis-[33%] max-w-[33%] ";
      } else {
        className = "grow-0 basis-[50%] max-w-[50%] ";
      }
    }
    return className;
  };
  const baseMediaClassName = "max-h-[100%]  !static ";

  return (
    <>
      <Card
        className={cn(
          " px-6 bg-black border-0  text-black rounded-none ",
          className
        )}
      >
        <div className="flex gap-x-2 ">
          <div className="flex items-start gap-x-2 mt-1">
            <UserAvatar user={comment.user} />
          </div>

          <div className="flex flex-col min-w-[0] ">
            <div className="p-4 pt-2 overflow-hidden border-solid flex-col gap-y-2 flex  bg-white rounded-3xl">
              <div className="flex flex-col ">
                <h4 className="font-bold text-md leading-[140%]">
                  {comment.user.name}
                </h4>
                {/* <h4 className=" items-center flex gap-x-1 text-[12px] font-medium text-muted-foreground">
              {multiFormatDateString(comment.createdAt.toUTCString())}
              {comment.privacyType === privacyTypeValue.PRIVATE ? (
                <Lock size={12} />
              ) : (
                <Globe size={12} />
              )}
            </h4> */}
              </div>
              <div className="">
                <p
                  className={`whitespace-pre-wrap leading-[140%] break-words ${
                    comment.isOverFlowContent && !expandConent && "line-clamp-3"
                  }`}
                >
                  {comment.content}
                </p>
                {comment.isOverFlowContent && (
                  <button
                    onClick={() => setExpandContent((prev) => !prev)}
                    className="text-blue-400 font-medium text-lg"
                  >
                    {expandConent ? "see less" : "see more"}
                  </button>
                )}
              </div>

              <MediaDisplayer
                className="max-w-[300px]"
                baseContainerClassName={baseContainerClassName}
                baseMediaClassName={baseMediaClassName}
                indexContainerClassName={indexContainerClassName}
                control={false}
                medias={comment.medias}
              />
            </div>
            <div className="flex gap-x-4">
              <LikeButton
                queryKey={[
                  QUERY_KEYS.GET_POST_COMMENTS,
                  comment.postId,
                  "comments",
                ]}
                parent={comment}
                className="flex space-x-2 px-0"
              />

              <Button variant={"postCard"} className="flex space-x-2 px-0">
                <MessageCircle size={18} />
                <span>{comment.repliesCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CommentCard;
