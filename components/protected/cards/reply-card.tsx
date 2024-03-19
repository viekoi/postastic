"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ReplyWithData } from "@/type";
import UserAvatar from "../user-avatar";
import {
  cn,
  mobileMultiFormatDateString,
  multiFormatDateString,
} from "@/lib/utils";
import { Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeButton from "../like-button";

import AttachmentDisplayer from "../attachment-displayer";

import { QUERY_KEYS } from "@/queries/react-query/query-keys";
import { privacyTypeValue } from "@/constansts";
import { useNewReplyModal } from "@/hooks/use-modal-store";
import useIsMobile from "@/hooks/use-is-mobile";

interface ReplyCardProps {
  reply: ReplyWithData;
  className?: string;
  isModalContent?: boolean;
}

const ReplyCard = ({ reply, className }: ReplyCardProps) => {
  const { onOpen } = useNewReplyModal();
  const [expandContent, setExpandContent] = useState(false);
  const isMobile = useIsMobile(1024);
  const [open, setOpen] = useState(false);

  const onNewReplyModalOpen = () => {
    onOpen(reply.postId, reply.parentId);
  };
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
            <UserAvatar user={reply.user} />
          </div>
          <div className="flex flex-col min-w-[0] w-full ">
            <div className="flex-shrink-0 max-w-fit">
              <div className=" p-4 pt-2 overflow-hidden border-solid flex-col gap-y-2 flex  bg-white rounded-3xl">
                <h4 className="font-bold text-md leading-[140%]">
                  {reply.user.name}
                </h4>

                <div className="">
                  <p
                    className={`whitespace-pre-wrap leading-[140%] break-words ${
                      reply.isOverFlowContent &&
                      !expandContent &&
                      "line-clamp-3"
                    }`}
                  >
                    {reply.content}
                  </p>
                  {reply.isOverFlowContent && (
                    <button
                      onClick={() => setExpandContent((prev) => !prev)}
                      className="text-blue-400 font-medium text-lg"
                    >
                      {expandContent ? "see less" : "see more"}
                    </button>
                  )}
                </div>

                <AttachmentDisplayer
                  className="max-w-[300px]"
                  baseContainerClassName={baseContainerClassName}
                  baseAttachmentClassName={baseMediaClassName}
                  indexContainerClassName={indexContainerClassName}
                  control={false}
                  medias={reply.attachments}
                />
              </div>
              <div className="flex gap-x-4">
                <LikeButton
                  queryKey={[
                    QUERY_KEYS.GET_COMMENT_REPLIES,
                    reply.postId,
                    reply.parentId,
                    "replies",
                  ]}
                  parent={reply}
                  className="flex space-x-1 px-0 leading-[140%]"
                />

                <Button
                  onClick={onNewReplyModalOpen}
                  className="px-0 leading-[140%]"
                  variant={"postCard"}
                >
                  <span className="">reply</span>
                </Button>
                <div className=" leading-[140%] items-center flex gap-x-1 text-[12px] font-medium text-muted-foreground">
                  {isMobile
                    ? mobileMultiFormatDateString(reply.createdAt.toUTCString())
                    : multiFormatDateString(reply.createdAt.toUTCString())}
                  {reply.privacyType === privacyTypeValue.PRIVATE ? (
                    <Lock size={12} />
                  ) : (
                    <Globe size={12} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ReplyCard;
