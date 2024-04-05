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
import { updateInteractCount } from "@/queries/react-query/optimistic-functions";
import { useDeleteMedia } from "@/queries/react-query/queris";
import { QUERY_KEYS_PREFLIX } from "@/queries/react-query/query-keys";
import { MediaWithData } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import { Delete, EyeOff, FileCog, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface SettingButtonProps {
  postAuthorId?:string
  comment: MediaWithData;
}

const SettingButton = ({ comment,postAuthorId }: SettingButtonProps) => {
  const queryClient = useQueryClient();
  const {
    onOpen: onAlertModalOpen,
    onClose,
    setIsPending,
  } = useAlertModal();
  const { user, isLoading } = useCurrentUser();
  const { onOpen } = useEditMediaModal();
  const { mutateAsync: deleteMedia, isPending: isPendingDelete } =
    useDeleteMedia([
      QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
      "comment",
      { parentId: comment.parentId },
    ]);

  const onDeleteMedia = async () => {
    setIsPending(isPendingDelete);
    await deleteMedia(comment.id).then((data) => {
      if (data.success) {
        updateInteractCount({
          queryClient,
          queryKeyPreflix: [QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS, "post"],
          parentId: comment.parentId,
          action: "delete",
        });
        toast.success(data.success);
        onClose();
      } else {
        onClose();
        toast.error(data.error);
      }
    });
  };

  if (isLoading || !user) return null;

  const isPostAuthor = postAuthorId === user.id;
  const isAuthor = user.id === comment.userId;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <div className="rounded-[50%] hover:bg-white size-8 flex items-center justify-center">
            <MoreHorizontal className="text-white hover:text-black" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 "
          onClick={(e) => e.stopPropagation()}
        >
          {!isAuthor && (
            <DropdownMenuItem onClick={() => {}}>
              hide comment
              <DropdownMenuShortcut>
                <EyeOff />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {isAuthor && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  onOpen(
                    comment.id,
                    [
                      QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
                      "comment",
                      { parentId: comment.postId },
                    ],
                    comment
                  )
                }
              >
                edit comment
                <DropdownMenuShortcut>
                  <FileCog />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
          {(isPostAuthor || isAuthor) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="bg-destructive"
                onClick={() => onAlertModalOpen(onDeleteMedia)}
              >
                delete comment
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
