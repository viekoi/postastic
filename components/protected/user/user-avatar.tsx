"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/type";

import Image from "next/image";

interface UserAvatarProps {
  user?: Omit<SessionUser, "isOAuth">;
  value?: string | null;
  className?: string;
  onClick?: () => void;
}

const UserAvatar = ({ user, className, onClick, value }: UserAvatarProps) => {
  return (
    <Avatar
      className={cn("", className, onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <AvatarImage src={value ? value : user?.avatarImage?.url || ""} />
      <AvatarFallback>
        <Image priority src={"/images/default-avatar.png"} fill alt="avatar" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
