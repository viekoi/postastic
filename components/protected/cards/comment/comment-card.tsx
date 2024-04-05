"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MediaWithData } from "@/type";
import UserAvatar from "../../user/user-avatar";
import {
  cn,
  mobileMultiFormatDateString,
  multiFormatDateString,
} from "@/lib/utils";
import { Globe, Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeButton from "../../like-button";

import AttachmentDisplayer from "../../attachment-displayer";

import { QUERY_KEYS_PREFLIX } from "@/queries/react-query/query-keys";
import { privacyTypeValue } from "@/constansts";
import ReplyContainer from "../../containers/reply/reply-container";
import { useCommentModal, useNewMediaModal } from "@/hooks/use-modal-store";
import SettingButton from "./setting-button";
import Link from "next/link";
import { useIsMobile } from "@/providers/is-mobile-provider";
import { useRouter } from "next/navigation";

interface CommentCardProps {
  postAuthorId?:string
  comment: MediaWithData;
  className?: string;
  isModalContent?: boolean;
}

const CommentCard = ({ comment, className,postAuthorId}: CommentCardProps) => {
  const [expandContent, setExpandContent] = useState(false);
  const [open, setOpen] = useState(false);
  const { onOpen } = useNewMediaModal();
  const { onClose } = useCommentModal();
  const { isMobile } = useIsMobile();
  const router = useRouter();
  const onNewReplyModalOpen = () => {
    onOpen(comment);
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
          <div className="flex items-center gap-y-2 mt-1 flex-col">
            <UserAvatar
              onClick={() => {
                router.push(`/profile/${comment.userId}`);
                onClose();
              }}
              user={comment.user}
            />
            <SettingButton postAuthorId={postAuthorId} comment={comment} />
          </div>
          <div className="flex flex-col min-w-[0] w-full ">
            <div className="flex-shrink-0 max-w-fit">
              <div className=" p-4 pt-2 overflow-hidden border-solid flex-col gap-y-2 flex  bg-white rounded-3xl">
                <Link
                  onClick={onClose}
                  href={`/profile/${comment.userId}`}
                  className="font-bold text-md leading-[140%]"
                >
                  {comment.user.name}
                </Link>
                <div className="">
                  <p
                    className={`whitespace-pre-wrap leading-[140%] break-words ${
                      comment.isOverFlowContent &&
                      !expandContent &&
                      "line-clamp-3"
                    }`}
                  >
                    {comment.content}
                  </p>
                  {comment.isOverFlowContent && (
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
                  medias={comment.attachments}
                />
              </div>
              <div className="flex gap-x-4">
                <LikeButton
                  queryKey={[QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,"comment",{parentId:comment.postId}]}
                  parent={comment}
                  className="flex space-x-1 px-0 leading-[140%]"
                />

                <Button
                  disabled={!!(comment.interactsCount === 0)}
                  onClick={() => setOpen((prev) => !prev)}
                  variant={"postCard"}
                  className="flex space-x-1 px-0 leading-[140%]"
                >
                  <MessageCircle size={18} />
                  <span>{comment.interactsCount}</span>
                </Button>
                <Button
                  onClick={onNewReplyModalOpen}
                  className="px-0 leading-[140%]"
                  variant={"postCard"}
                >
                  <span className="">reply</span>
                </Button>
                <div className=" leading-[140%] items-center flex gap-x-1 text-[12px] font-medium text-muted-foreground">
                  {isMobile
                    ? mobileMultiFormatDateString(
                        comment.createdAt.toUTCString()
                      )
                    : multiFormatDateString(comment.createdAt.toUTCString())}
                  {comment.privacyType === privacyTypeValue.PRIVATE ? (
                    <Lock size={12} />
                  ) : (
                    <Globe size={12} />
                  )}
                </div>
              </div>
            </div>
            {open && (
              <ReplyContainer
                initialInteractCount={comment.interactsCount}
                postId={comment.postId}
                parentId={comment.id}
              />
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default CommentCard;
