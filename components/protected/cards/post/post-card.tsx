"use client";
import React, { useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MediaWithData } from "@/type";
import UserAvatar from "../../user/user-avatar";
import {
  cn,
  mobileMultiFormatDateString,
  multiFormatDateString,
} from "@/lib/utils";
import { Globe, Lock, MessageCircle, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeButton from "../../like-button";
import {  privacyTypeValue } from "@/constansts";
import AttachmentDisplayer from "../../attachment-displayer";
import { useCommentModal } from "@/hooks/use-modal-store";
import SettingButton from "./setting-button";
import Link from "next/link";
import { useIsMobile } from "@/providers/is-mobile-provider";
import { useRouter } from "next/navigation";
import { QUERY_KEYS_PREFLIX } from "@/queries/react-query/query-keys";

interface PostCardProps {
  post: MediaWithData;
  className?: string;
  isModalContent?: boolean;
}

const PostCard = ({
  post,
  className,
  isModalContent = false,
}: PostCardProps) => {
  const [expandConent, setExpandContent] = useState(false);
  const { onOpen } = useCommentModal();
  const { isMobile } = useIsMobile();
  const router = useRouter();
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

  const onReplyModalOpen = useCallback(() => {
    onOpen(post);
  }, [post]);

  return (
    <>
      <Card
        className={cn(
          "bg-black border-0 border-b-[0.5px] border-gray-600 text-white rounded-none flex-shrink-0  ",
          className
        )}
      >
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex items-start gap-x-2 ">
              <UserAvatar
                onClick={() => router.push(`/profile/${post.userId}`)}
                user={post.user}
              />
              <div className="flex flex-col ">
                <Link
                  href={`/profile/${post.userId}`}
                  className="font-medium text-sm leading-[140%]"
                >
                  {post.user.name}
                </Link>
                <h4 className=" items-center flex gap-x-1 text-[12px] font-medium text-muted-foreground">
                  {isMobile
                    ? mobileMultiFormatDateString(post.createdAt.toUTCString())
                    : multiFormatDateString(post.createdAt.toUTCString())}
                  {post.privacyType === privacyTypeValue.PRIVATE ? (
                    <Lock size={12} />
                  ) : (
                    <Globe size={12} />
                  )}
                </h4>
              </div>
            </div>
            <SettingButton post={post} />
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden border-solid flex-col flex gap-2 min-w-[0]">
          <div>
            <p
              className={`text-white whitespace-pre-wrap break-words ${
                post.isOverFlowContent && !expandConent && "line-clamp-3"
              }`}
            >
              {post.content}
            </p>
            {post.isOverFlowContent && (
              <button
                onClick={() => setExpandContent((prev) => !prev)}
                className="text-blue-400 font-medium text-lg"
              >
                {expandConent ? "see less" : "see more"}
              </button>
            )}
          </div>

          <AttachmentDisplayer
            baseContainerClassName={baseContainerClassName}
            indexContainerClassName={indexContainerClassName}
            baseAttachmentClassName={baseMediaClassName}
            control={false}
            medias={post.attachments}
          />
        </CardContent>
        <CardFooter
          className={cn(
            "grid p-0 grid-cols-3 border-t-[0.5px] border-gray-600",
            isModalContent && "grid-cols-2"
          )}
        >
          <LikeButton
            queryKey={[QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,"post"]}
            parent={post}
            className=" col-span-1 space-x-2"
          />
          {!isModalContent && (
            <Button
              onClick={onReplyModalOpen}
              variant={"postCard"}
              className=" col-span-1 space-x-2"
            >
              <MessageCircle size={18} />
              <span>{post.interactsCount}</span>
            </Button>
          )}
          <Button variant={"postCard"} className=" col-span-1 space-x-2">
            <Repeat2 size={18} />
            <span>0</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default PostCard;
