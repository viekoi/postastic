"use client";
import React from "react";
import Media from "./attachment";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { UploadFile } from "@/type";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useImageCarouselModal } from "@/hooks/use-modal-store";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";

const AttachmentDisplayerVariants = cva(
  "flex flex-wrap justify-center relative group rounded-3xl",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-[3px] border-gray-600 border-dashed",
      },
      size: {
        default: "",
        outline: "p-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
interface AttachmentDisplayerProps
  extends VariantProps<typeof AttachmentDisplayerVariants> {
  medias: UploadFile[];
  className?: string;
  control: boolean;
  disabled?: boolean;
  baseContainerClassName?: string;
  indexContainerClassName?: (index: number, dataLength: number) => string;
  baseAttachmentClassName?: string;
  indexAttachmentClassName?: (index: number, dataLength: number) => string;
  open?: () => void;
  onRemoveFiles?: () => void;
  onRemoveFile?: (index: number) => void;
}

const AttachmentDisplayer = (props: AttachmentDisplayerProps) => {
  const {
    medias,
    variant,
    size,
    className,
    control,
    disabled,
    baseContainerClassName,
    indexContainerClassName,
    baseAttachmentClassName: baseAttachmentClassName,
    indexAttachmentClassName: indexMediaClassName,
    open,
    onRemoveFile,
    onRemoveFiles,
  } = props;
  const { onCancel } = useIsAddingFiles();
  const { onOpen: onImgCarouselOpen } = useImageCarouselModal();
  const onImageClick = (index: number) => {
    onImgCarouselOpen(index, medias);
  };

  if (
    control &&
    open === undefined &&
    onRemoveFile === undefined &&
    onRemoveFiles === undefined
  ) {
    throw new Error(
      "open, onRemoveFile, onRemoveFiles props are needed when control is true"
    );
  }

  return (
    <>
      {medias.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            AttachmentDisplayerVariants({ variant, size, className })
          )}
        >
          {medias.map((media, index) => {
            const indexCCN =
              indexContainerClassName &&
              indexContainerClassName(index, medias.length);
            const indexMCN =
              indexMediaClassName && indexMediaClassName(index, medias.length);

            return (
              <Media
                onClick={() => onImageClick(index)}
                onRemove={
                  control
                    ? () => onRemoveFile && onRemoveFile(index)
                    : undefined
                }
                isError={media.error}
                containerClassName={cn(
                  `${baseContainerClassName}`,
                  `${indexCCN}`
                )}
                attachmentClassName={cn(
                  `${baseAttachmentClassName}`,
                  `${indexMCN}`
                )}
                url={media.url as string}
                type={media.type}
                key={index}
              />
            );
          })}
          {control && (
            <>
              <div className="absolute inline-flex lg:hidden group-hover:inline-flex -top-5 -left-5 gap-x-1">
                <Button
                  disabled={disabled}
                  type="button"
                  variant={"secondary"}
                  size={"icon"}
                  onClick={open}
                >
                  <Plus />
                </Button>
                <Button
                  disabled={disabled}
                  className=""
                  type="button"
                  size={"link"}
                  variant={"secondary"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFiles && onRemoveFiles();
                  }}
                >
                  clear all
                </Button>
              </div>
              <Button
                disabled={disabled}
                className="absolute inline-flex lg:hidden group-hover:inline-flex -top-5 -right-5 rounded-full"
                type="button"
                variant={"secondary"}
                size={"icon"}
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                  onRemoveFiles && onRemoveFiles();
                }}
              >
                <X />
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AttachmentDisplayer;
