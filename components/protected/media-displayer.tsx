"use client";
import React from "react";
import Media from "./media";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { MediaFile } from "@/type";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useImageCarouselModal } from "@/hooks/use-modal-store";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import { useFilesUploadActions } from "@/hooks/use-files-upload-actions";

const MediaDisplayerVariants = cva(
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
interface MediaDisplayerProps
  extends VariantProps<typeof MediaDisplayerVariants> {
  medias: MediaFile[];
  className?: string;
  control: boolean;
  disabled?: boolean;
  baseContainerClassName?: string;
  indexContainerClassName?: (index: number, dataLength: number) => string;
  baseMediaClassName?: string;
  indexMediaClassName?: (index: number, dataLength: number) => string;
  open?: () => void;
}

const MediaDisplayer = (props: MediaDisplayerProps) => {
  const {
    medias,
    variant,
    size,
    className,
    control,
    disabled,
    baseContainerClassName,
    indexContainerClassName,
    baseMediaClassName,
    indexMediaClassName,
    open,
  } = props;
  const { onCancel } = useIsAddingFiles();
  const { onRemoveFile, onRemoveFiles } = useFilesUploadActions();
  const { onOpen: onImgCarouselOpen } = useImageCarouselModal();
  const onImageClick = (index: number) => {
    onImgCarouselOpen(index, medias);
  };

  if (control && !open) {
    throw new Error("open prop is needed when control is true");
  }

  return (
    <>
      {medias.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(MediaDisplayerVariants({ variant, size, className }))}
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
                onRemove={control ? () => onRemoveFile(index) : undefined}
                isError={media.error}
                containerClassName={cn(
                  `${baseContainerClassName}`,
                  `${indexCCN}`
                )}
                mediaClassName={cn(`${baseMediaClassName}`, `${indexMCN}`)}
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
                    onRemoveFiles();
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
                  onRemoveFiles();
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

export default MediaDisplayer;
