import React from "react";
import Media from "./media";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { MediaFile } from "@/type";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import * as z from "zod";

const MediaDisplayerSchema = z
  .object({
    medias:z.array(z.custom<MediaFile>()), // Replace with your MediaFile type
    className: z.string().optional(),
    onRemoveMedia:  z.function().args(z.number()).optional(),
    onRemoveAll: z.function().optional(),
    control: z.boolean(),
    disabled: z.boolean().optional(),
    onOpen: z.function().optional(),
    onCancel: z.function().optional(),
  })
  .refine(
    (data) =>
      !data.control ||
      (data.control &&
        data.onRemoveMedia &&
        data.onRemoveAll &&
        data.onOpen &&
        data.onCancel),
    {
      message:
        "When control is true, onRemoveMedia, onRemoveAll, onOpen, and onCancel props must be provided",
      path: ["control", "onRemoveMedia", "onRemoveAll", "onOpen", "onCancel"],
    }
  );

const MediaDisplayerVariants = cva(
  "grid grid-cols-2 justify-center relative group rounded-3xl",
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

type MediaDisplayerProps = VariantProps<typeof MediaDisplayerVariants> &
  z.infer<typeof MediaDisplayerSchema> & {
    medias: MediaFile[];
  };

const MediaDisplayer = (props: MediaDisplayerProps) => {
  try {
    const validatedProps = MediaDisplayerSchema.parse(props);
    const { medias, variant, size } = props;
    const {
      className,
      onRemoveMedia,
      onRemoveAll,
      control,
      onOpen,
      onCancel,
      disabled,
    } = validatedProps;
    return (
      <>
        {medias.length > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(MediaDisplayerVariants({ variant, size, className }))}
          >
            {medias.map((media, index) => {
              return (
                <Media
                  onRemove={
                    control
                      ? () => onRemoveMedia && onRemoveMedia(index)
                      : undefined
                  }
                  isError={media.error}
                  containerClassName={
                    index === 0 && medias.length % 2 === 1
                      ? "col-span-2"
                      : "col-span-1"
                  }
                  mediaClassName={
                    index === 0 && medias.length % 2 === 1
                      ? "bg-contain"
                      : "bg-cover"
                  }
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
                    onClick={onOpen}
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
                      onRemoveAll && onRemoveAll();
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
                    onCancel && onCancel();
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
  } catch (err) {
    // Handle the error, for example, log it
    console.error("Invalid props:", err);
  }
};

export default MediaDisplayer;
