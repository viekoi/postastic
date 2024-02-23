"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
import { cn } from "@/lib/utils";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  children,
  onClose,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <DialogContent
        className={cn(
          `
        custom-scrollbar
        overflow-y-auto
        fixed 
        drop-shadow-md 
        border 
        border-gray-600 
        top-[50%]
        left-[50%] 
        max-h-full 
        h-full 
        lg:h-auto 
        lg:max-h-[85vh] 
        w-full 
        lg:max-w-[500px] 
        translate-x-[-50%]
        translate-y-[-50%]
        rounded-md 
        bg-black
        p-[25px] 
        focus:outline-none
        z-50
        `
        )}
      >
        {title && (
          <DialogTitle
            className="
              text-white
              text-xl 
              text-center 
              font-bold 
              pb-4
              border-b-[0.5px]
              border-solid
              border-gray-600
              "
          >
            {title}
          </DialogTitle>
        )}
        {description && (
          <DialogDescription
            className="
            text-white
        mb-5 
        text-sm 
        leading-normal 
        text-center
      "
          >
            {description}
          </DialogDescription>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
