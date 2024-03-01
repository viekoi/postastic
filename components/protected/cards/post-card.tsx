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
import MediaDisplayer from "../media-displayer";

interface PostCardProps {
  post: PostWithData;
  className?: string;
  currentPage: number;
}

const PostCard = ({ post, className, currentPage }: PostCardProps) => {
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

       <MediaDisplayer control={false} medias={post.medias}/>
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

        <LikeButton post={post} currentPage={currentPage} />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
