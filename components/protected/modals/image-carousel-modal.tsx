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
import Media from "../media";

const ImageCarouselModal = () => {
  const { isOpen, onClose, medias, startIndex } = useImageCarouselModal();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-0 h-screen items-center justify-center "
    >
      <Carousel
        opts={{
          loop: true,
          startIndex: startIndex ? startIndex : 0,
        }}
        className=" group flex items-center justify-center w-full lg:max-w-[90vw] h-full"
      >
        <CarouselContent className=" flex items-center h-full ">
          {medias.map((media, index) => (
            <CarouselItem key={index} className="h-full" >
              <Media
                url={media.url as string}
                type={media.type}
                mediaClassName="bg-contain max-h-[100%] object-contain"
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
