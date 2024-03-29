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
import {
  useDeleteMedia,
  useGetPostCreator,
} from "@/queries/react-query/queris";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";
import { MediaWithData } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import { Delete, EyeOff, FileCog, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface SettingButtonProps {
  reply: MediaWithData;
}

const SettingButton = ({ reply }: SettingButtonProps) => {
  const queryClient = useQueryClient();
  const {
    isOpen,
    onOpen: onAlertModalOpen,
    onClose,
    setIsPending,
  } = useAlertModal();
  const { user, isLoading } = useCurrentUser();
  const { onOpen } = useEditMediaModal();
  const { data: creator, isPending, error } = useGetPostCreator(reply.postId);
  const { mutateAsync: deleteMedia, isPending: isPendingDelete } =
    useDeleteMedia([
      QUERY_KEYS.GET_COMMENT_REPLIES,
      reply.postId,
      reply.parentId,
      "replies",
    ]);

  const onDeleteMedia = async () => {
    setIsPending(true);
    await deleteMedia(reply.id).then((data) => {
      if (data.success) {
        updateInteractCount({
          queryClient,
          queryKey: [QUERY_KEYS.GET_POST_COMMENTS, reply.postId, "comments"],
          parentId: reply.parentId,
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

  if (isPending || !user) return null;
  if (error || !creator?.success) return null;

  const isPostAuthor = creator.success.postCreatorId === user.id;
  const isAuthor = user.id === reply.userId;
  return (
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
            hide reply
            <DropdownMenuShortcut>
              <EyeOff />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {isAuthor && (
          <>
            <DropdownMenuItem
              onClick={() =>
                onOpen(reply.id, [
                  QUERY_KEYS.GET_COMMENT_REPLIES,
                  reply.postId,
                  reply.parentId,
                  "replies",
                ])
              }
            >
              edit reply
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
              delete reply
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
