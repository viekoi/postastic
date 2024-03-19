"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  children,
  className,
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
        flex
        flex-col
        custom-scrollbar
        overflow-y-scroll
        border 
        border-gray-600 
        h-full 
        w-full  
        rounded-md 
        bg-black
        p-[25px] 
        focus:outline-none
        z-50
        `,
          className
        )}
      >
        {title && (
          <DialogTitle
            className="
              text-white
              text-xl 
              text-center 
              font-bold 
              border-b-[0.5px]
              border-solid
              border-gray-600
              p-4
              relative
              "
          >
            {title}
            <DialogClose className=" border-none bg-red-400 opacity-70 hover:opacity-100 rounded-full absolute top-2 right-2 ">
              <X size={40} />
            </DialogClose>
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
        {!title && (
          <DialogClose className="border-none bg-red-400 opacity-70 hover:opacity-100 rounded-full absolute top-2 right-2 ">
            <X size={40} />
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
