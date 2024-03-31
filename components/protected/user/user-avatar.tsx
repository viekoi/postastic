"use client";
import { ExtendedUser } from "@/next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { User } from "@/lib/db/schema";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: ExtendedUser | User;

  className?: string;
  onClick?: () => void;
}

const UserAvatar = ({ user, className, onClick }: UserAvatarProps) => {
  return (
    <Avatar
      className={cn("", className, onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <AvatarImage src={user?.image || ""} />
      <AvatarFallback>
        {" "}
        <UserIcon stroke="black" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
