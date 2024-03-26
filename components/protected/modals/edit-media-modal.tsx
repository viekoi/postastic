"use client";
import React from "react";
import Modal from "./modal";
import { useEditMediaModal } from "@/hooks/use-modal-store";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import useIsMobile from "@/hooks/use-is-mobile";
import DrawerModal from "../drawers/drawer";
import Edit from "../forms/media/edit/edit";

const EditMediaModal = () => {
  const { isOpen, onClose, id, queryKey } = useEditMediaModal();
  const { onCancel } = useIsAddingFiles();
  const isMobile = useIsMobile(1024);

  if (id === null) return;

  if (queryKey === null) return;

  if (isMobile) {
    return (
      <DrawerModal
        className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px] z-[1000]  "
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onCancel();
        }}
      >
        <div className="overflow-x-hidden overflow-y-auto custom-scrollbar">
          <Edit id={id} queryKey={queryKey} />
        </div>
      </DrawerModal>
    );
  }
  return (
    <Modal
      className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px]  z-[1000] "
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onCancel();
      }}
    >
      <div className="overflow-x-hidden overflow-y-auto custom-scrollbar">
        <Edit id={id} queryKey={queryKey} />
      </div>
    </Modal>
  );
};

export default EditMediaModal;
