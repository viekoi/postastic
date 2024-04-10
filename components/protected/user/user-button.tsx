"use client";
import { LogOut, MoreHorizontal } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Button } from "../../ui/button";
import UserAvatar from "./user-avatar";
import { SessionUser } from "@/type";


const UserButton = ({ user }: { user: SessionUser | undefined }) => {
  return (
    <Link href={`/profile/${user?.id}`} className="group w-full">
      <Button
        variant={"ghost"}
        className="h-auto justify-between w-full"
        size={"link"}
      >
        <div className="flex space-x-2 items-center">
          <UserAvatar user={user} />
          <div className="text-left text-sm">
            <div className="font-semibold">{user?.name}</div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="outline-none">
            <div className="rounded-[50%] group-hover:bg-black  p-1">
              <MoreHorizontal className="text-white" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 "
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => signOut()}>
              Sign out
              <DropdownMenuShortcut>
                <LogOut />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>
    </Link>
  );
};

export default UserButton;
