"use client";
import React from "react";
import Modal from "./modal";
import { useEditMediaModal } from "@/hooks/use-modal-store";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import useIsMobile from "@/hooks/use-is-mobile";
import DrawerModal from "../drawers/drawer";
import Edit from "../forms/edit/edit";

const EditMediaModal = () => {
  const { isOpen, onClose, id, queryKey } = useEditMediaModal();
  const { onCancel } = useIsAddingFiles();
  const isMobile = useIsMobile(1024);

  if (id === null) return;

  if (queryKey === null) return;

  if (isMobile) {
    return (
      <DrawerModal
        className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px]  "
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onCancel();
        }}
      >
        <Edit id={id} queryKey={queryKey} />
      </DrawerModal>
    );
  }
  return (
    <Modal
      className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px]  "
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onCancel();
      }}
    >
      <Edit id={id} queryKey={queryKey} />
    </Modal>
  );
};

export default EditMediaModal;
