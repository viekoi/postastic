"use client";
import React from "react";
import Modal from "./modal";
import { useNewPostModal } from "@/hooks/use-modal-store";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import useIsMobile from "@/hooks/use-is-mobile";
import DrawerModal from "../drawers/drawer";
import NewPostForm from "../forms/post/new-post-form";

const NewPostModal = () => {
  const { isOpen, onClose } = useNewPostModal();
  const { onCancel } = useIsAddingFiles();
  const isMobile = useIsMobile(1024);

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
        <NewPostForm />
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
      <NewPostForm />
    </Modal>
  );
};

export default NewPostModal;
