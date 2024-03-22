"use client";
import React from "react";
import Modal from "./modal";
import { useNewReplyModal } from "@/hooks/use-modal-store";

import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import NewReplyForm from "../forms/reply/new-reply-form";
import useIsMobile from "@/hooks/use-is-mobile";
import DrawerModal from "../drawers/drawer";
import { CornerDownRight } from "lucide-react";

const NewReplyModal = () => {
  const { isOpen, onClose, postId, parentId,parentUserName } = useNewReplyModal();
  const { onCancel } = useIsAddingFiles();
  const isMobile = useIsMobile(1024);

  if (!postId || !parentId) return null;

  if (isMobile) {
    return (
      <DrawerModal
        className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px] "
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onCancel();
        }}
      >
        <NewReplyForm postId={postId} parentId={parentId} />
      </DrawerModal>
    );
  }
  return (
    <Modal
      className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px] "
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onCancel();
      }}
    >
      <div className="flex gap-x-1 items-center p-4">
        <CornerDownRight />
        <div className="pt-2">Replying to {parentUserName}</div>
      </div>
      <NewReplyForm postId={postId} parentId={parentId} />
    </Modal>
  );
};

export default NewReplyModal;
