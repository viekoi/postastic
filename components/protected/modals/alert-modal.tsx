"use client";

import { Button } from "@/components/ui/button";
import Modal from "./modal";
import { useAlertModal } from "@/hooks/use-modal-store";

export const AlertModal = () => {
  const { isOpen, onClose, isPending,onConfirm } = useAlertModal();
  return (
    <Modal
      title="Are you sure?"
      description="This action cant be reverted."
      className=" max-h-fit h-fit lg:max-w-[400px] mx-auto z-[1001]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-x-2 flex items-center justify-end w-full p-2">
        <Button disabled={isPending} variant="secondary" onClick={onClose}>
          cancel
        </Button>
        <Button disabled={isPending} variant="destructive" onClick={onConfirm}>
          confirm
        </Button>
      </div>
    </Modal>
  );
};
