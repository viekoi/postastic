"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { Trash } from "lucide-react";

interface MediaProps {
  containerClassName?: string;
  mediaClassName?: string;
  url: string;
  type: "image" | "video";
  onRemove?: () => void;
  disabled?: boolean;
}

const Media = ({
  disabled,
  containerClassName,
  mediaClassName,
  url,
  type,
  onRemove,
}: MediaProps) => {
  const onRemoveFile = (e: any) => {
    onRemove && onRemove();
  };

  // revent re-render when type
  const callbackReturn = useCallback(() => {
    return (
      <div
        className={cn(
          " col-span-2 overflow-hidden p-1 border border-gray-600 relative group",
          containerClassName
        )}
      >
        {type === "image" ? (
          <div
            className={cn(
              `pt-[50%] relative bg-cover bg-no-repeat bg-center`,
              mediaClassName
            )}
            style={{
              backgroundImage: `url(${url})`,
            }}
          />
        ) : (
          <video className="h-full w-full rounded-lg" controls autoPlay muted>
            <source src={url} type="video/mp4" />
          </video>
        )}

        {!disabled && onRemove && (
          <Button
            size={"icon"}
            variant={"destructive"}
            type="button"
            className=" absolute top-1 right-1 inline-flex lg:hidden group-hover:inline-flex"
            onClick={(e) => onRemoveFile(e)}
          >
            <Trash />
          </Button>
        )}
      </div>
    );
  }, [containerClassName, mediaClassName, url, disabled]);

  return callbackReturn();
};

export default Media;
