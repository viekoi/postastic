"use client";
import React from "react";
import Modal from "./modal";
import { useEditMediaModal } from "@/hooks/use-modal-store";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import DrawerModal from "../drawers/drawer";
import Edit from "../forms/media/edit/edit";
import { useIsMobile } from "@/providers/is-mobile-provider";

const EditMediaModal = () => {
  const { isOpen, onClose, id, queryKeyPreflix, media } = useEditMediaModal();
  const { onCancel } = useIsAddingFiles();

  const { isMobile } = useIsMobile();

  if (!id) return;

  if (queryKeyPreflix === null) return;

  if (!media) return;

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
          <Edit id={id} queryKeyPreflix={queryKeyPreflix} media={media} />
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
        <Edit id={id} queryKeyPreflix={queryKeyPreflix} media={media} />
      </div>
    </Modal>
  );
};

export default EditMediaModal;
