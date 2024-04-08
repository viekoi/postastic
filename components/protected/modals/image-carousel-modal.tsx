"use client";
import React from "react";
import Modal from "./modal";
import { useImageCarouselModal } from "@/hooks/use-modal-store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Media from "../attachment";

const ImageCarouselModal = () => {
  const { isOpen, onClose, attachments, startIndex } = useImageCarouselModal();
  return (
    <Modal
      showCloseBtn
      isOpen={isOpen}
      onClose={onClose}
      className=" h-screen items-center justify-center z-[1001] "
    >
      <Carousel
        opts={{
          loop: true,
          startIndex: startIndex ? startIndex : 0,
        }}
        className=" group flex items-center justify-center w-full lg:max-w-[90vw] h-full"
      >
        <CarouselContent className=" flex items-center h-full ">
          {attachments.map((attachment, index) => (
            <CarouselItem key={index} className="h-full">
              <Media
                url={attachment.url as string}
                type={attachment.type}
                attachmentClassName="bg-contain max-h-[100%] object-contain"
                containerClassName="border-[0px] h-full"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant={"blue"}
          className=" z-50  size-12 hidden lg:inline-flex"
        />
        <CarouselNext
          variant={"blue"}
          className=" z-50  size-12  hidden lg:inline-flex "
        />
      </Carousel>
    </Modal>
  );
};

export default ImageCarouselModal;
