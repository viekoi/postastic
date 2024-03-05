"use client";
import React from "react";
import Modal from "./modal";
import { useNewPostModal } from "@/hooks/use-modal-store";
import NewPostForm from "../forms/new-post-form";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import { useFilesUploadActions } from "@/hooks/use-files-upload-actions";

const NewPostModal = () => {
  const { isOpen, onClose } = useNewPostModal();
  const { onRemoveFiles } = useFilesUploadActions();
  const { onCancel } = useIsAddingFiles();
  return (
    <Modal
      className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px] "
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onRemoveFiles();
        onCancel();
      }}
    >
      <NewPostForm />
    </Modal>
  );
};

export default NewPostModal;
