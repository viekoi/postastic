"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { Trash } from "lucide-react";
import Image from "next/image";

interface MediaProps {
  containerClassName?: string;
  mediaClassName?: string;
  url: string;
  type: "image" | "video";
  onClick?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  isError?: boolean;
}

const Media = ({
  disabled,
  containerClassName,
  mediaClassName,
  url,
  type,
  isError,
  onRemove,
  onClick,
}: MediaProps) => {
  const onRemoveFile = (e: any) => {
    onRemove && onRemove();
  };

  // revent re-render when type
  const callbackReturn = useCallback(() => {
    return (
      <div
        onClick={() => onClick && onClick()}
        className={cn(
          " overflow-hidden relative group  ",
          containerClassName,
          isError && "border-rose-600 border-[3px]"
        )}
      >
        {type === "image" ? (
          <Image
            quality={100}
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
            src={url}
            alt="image"
            fill
            className={cn(
              "bg-cover bg-no-repeat bg-center object-cover",
              mediaClassName
            )}
          />
        ) : (
          <video
            className="h-full w-full rounded-lg"
            controls
            autoPlay={false}
            muted
          >
            <source src={url} type="video/mp4" />
          </video>
        )}

        {!disabled && onRemove && (
          <Button
            size={"icon"}
            variant={"destructive"}
            type="button"
            className=" absolute top-1 right-1 inline-flex lg:hidden group-hover:inline-flex"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile(e);
            }}
          >
            <Trash />
          </Button>
        )}
      </div>
    );
  }, [
    disabled,
    containerClassName,
    mediaClassName,
    url,
    type,
    isError,
    onRemove,
  ]);

  return callbackReturn();
};

export default Media;
