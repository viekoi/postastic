"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useNewPostModal } from "@/hooks/use-modal-store";
import { Bookmark, Delete, FileCog, MoreHorizontal } from "lucide-react";

interface SettingButton {
  userId: string;
  id:string;
}

const SettingButton = ({ userId,id }: SettingButton) => {
  const { user, isLoading } = useCurrentUser();
  const {onOpen} = useNewPostModal()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="outline-none">
        <div className="rounded-[50%] hover:bg-white size-8 flex items-center justify-center">
          <MoreHorizontal className="hover:text-black" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 "
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onClick={() => {}}>
          Save post
          <DropdownMenuShortcut>
            <Bookmark />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {user?.id === userId && (
          <>
            <DropdownMenuItem onClick={() => onOpen(id)}>
              Edit post
              <DropdownMenuShortcut>
                <FileCog />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="bg-destructive" onClick={() => {}}>
              Delete post
              <DropdownMenuShortcut>
                <Delete />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingButton;
