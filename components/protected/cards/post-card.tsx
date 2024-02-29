"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PostWithData } from "@/type";
import UserAvatar from "../user-avatar";
import { cn, multiFormatDateString } from "@/lib/utils";
import { Globe, Lock, MessageCircle, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeButton from "../like-button";
import { privacyTypeValue } from "@/constansts";
import Media from "../media";

interface PostCardProps {
  post: PostWithData;
  className?: string;
}

const PostCard = ({ post, className }: PostCardProps) => {
  return (
    <Card
      className={cn(
        "bg-black border-0 border-b-[0.5px] border-gray-600 text-white rounded-none",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-x-2">
          <UserAvatar user={post.user} />
          <div className="flex flex-col ">
            <h4 className="font-medium text-sm leading-[140%]">
              {post.user.name}
            </h4>
            <h4 className=" items-center flex gap-x-1 text-[12px] font-medium text-muted-foreground">
              {multiFormatDateString(post.createdAt.toUTCString())}
              {post.privacyType === privacyTypeValue.PRIVATE ? (
                <Lock size={12} />
              ) : (
                <Globe size={12} />
              )}
            </h4>
          </div>
        </div>
      </CardHeader>
      <CardContent className="  overflow-hidden  border-solid flex-col flex gap-2">
        <CardDescription
          className={`text-white over ${
            post.isOverFlowContent && "line-clamp-3"
          }`}
        >
          {post.content}
        </CardDescription>

        {post.medias.length > 0 && (
          <div className="grid grid-cols-2 justify-center relative group  rounded-3xl">
            {post.medias.map((media, index) => {
              return (
                <Media
                  containerClassName={
                    index === 0 && post.medias.length % 2 === 1
                      ? "col-span-2"
                      : "col-span-1"
                  }
                  mediaClassName={
                    index === 0 && post.medias.length % 2 === 1
                      ? "bg-contain"
                      : "bg-cover"
                  }
                  url={media.url}
                  type={media.type}
                  key={media.id}
                />
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="grid p-0 grid-cols-3 border-t-[0.5px] border-gray-600">
        <Button variant={"ghost"} className=" col-span-1 space-x-2">
          <MessageCircle size={18} />
          <span>10</span>
        </Button>
        <Button variant={"ghost"} className=" col-span-1 space-x-2">
          <Repeat2 size={18} />
          <span>10</span>
        </Button>

        <LikeButton post={post} />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
