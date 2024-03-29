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
import { useAlertModal, useEditMediaModal } from "@/hooks/use-modal-store";

import { useDeleteMedia } from "@/queries/react-query/queris";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";
import { MediaWithData } from "@/type";
import {
  Bookmark,
  Delete,
  EyeOff,
  FileCog,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface SettingButtonProps {
  post: MediaWithData;
}

const SettingButton = ({ post }: SettingButtonProps) => {
  const {
    isOpen,
    onOpen: onAlertModalOpen,
    onClose,
    setIsPending,
  } = useAlertModal();
  const { user, isLoading } = useCurrentUser();
  const { onOpen } = useEditMediaModal();
  const { mutateAsync: deleteMedia, isPending } = useDeleteMedia([
    QUERY_KEYS.GET_INFINITE_MEDIAS,null
  ]);

  const onDeleteMedia = async () => {
    setIsPending(true);
    await deleteMedia(post.id).then((data) => {
      if (data.success) {
        toast.success(data.success);
        onClose();
      } else {
        toast.error(data.error);
        onClose();
      }
    });
  };

  const isAuthor = user?.id === post.userId;
  return (
    <>
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
            save post
            <DropdownMenuShortcut>
              <Bookmark />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {!isAuthor && (
            <DropdownMenuItem onClick={() => {}}>
              hide post
              <DropdownMenuShortcut>
                <EyeOff />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {isAuthor && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen(post.id, [QUERY_KEYS.GET_INFINITE_MEDIAS,null])}
              >
                edit post
                <DropdownMenuShortcut>
                  <FileCog />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="bg-destructive"
                onClick={() => onAlertModalOpen(onDeleteMedia)}
              >
                delete post
                <DropdownMenuShortcut>
                  <Delete />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default SettingButton;
