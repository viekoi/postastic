"use client";
import { cn, convertFileToUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCallback, useEffect } from "react";
import { Trash } from "lucide-react";

interface FormMediaProps {
  containerClassName?: string;
  mediaClassName?: string;
  file: File;
  onRemove?: () => void;
  disabled: boolean;
}

const FormMedia = ({
  disabled,
  containerClassName,
  mediaClassName,
  file,
  onRemove,
}: FormMediaProps) => {
  const onRemoveFile = (e: any) => {
    onRemove && onRemove();
  };
  // revent re-render when type

  const callbackReturn = useCallback(() => {
    const url = convertFileToUrl(file);



    return (
      <div
        className={cn(
          " col-span-2 overflow-hidden p-1 border border-gray-600 relative group",
          containerClassName
        )}
      >
        {file.type === "image" ? (
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

        <Button
          disabled={disabled}
          size={"icon"}
          variant={"destructive"}
          type="button"
          className=" absolute top-1 right-1 inline-flex lg:hidden group-hover:inline-flex"
          onClick={(e) => onRemoveFile(e)}
        >
          <Trash />
        </Button>
      </div>
    );
  }, [containerClassName, mediaClassName, file]);

  return callbackReturn();
};

export default FormMedia;
