"use client";
import { convertFileToUrl } from "@/lib/utils";
import { Image, Plus, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import { toast } from "sonner";
import Media from "./media";
import { Base64File } from "@/type";

type FileUploaderProps = {
  fieldChange: (files: Base64File[]) => void;
  disabled: boolean;
};

const FileUploader = ({ fieldChange, disabled }: FileUploaderProps) => {
  const [files, setFiles] = useState<Base64File[]>([]);


  const { onCancel } = useIsAddingFiles();

  const handleSetFiles = (acceptedFiles: FileWithPath[]) => {
    if (files.length + acceptedFiles.length > 5) {
      return toast.error(`Error: One post can only have 5 files`);
    }

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          {
            base64Url: reader.result,
            blobUrl: convertFileToUrl(file),
            type: file.type.includes("image") ? "image" : "video",
          },
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      handleSetFiles(acceptedFiles);
    },
    [files]
  );

  const onRemoveFileFiles = () => {
    setFiles([]);
  };

  const onRemoveFileFile = (index: number) => {
    setFiles((prev) => {
      const updatedFiles = [...prev].filter((file, fIndex) => {
        return fIndex !== index;
      });

      return updatedFiles;
    });
  };

  useEffect(() => {
    fieldChange(files);
  }, [files]);

  useEffect(() => {
    return () => {
      files.map((file) => URL.revokeObjectURL(file.blobUrl));
    };
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".MP4"],
    },
    onDropRejected: (rejectedFiles) => {
      toast.error(`Error: ${rejectedFiles[0].errors[0].message}`);
    },
    maxFiles: 5,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="grid grid-cols-2 justify-center relative group border-[3px] border-gray-600 border-dashed p-5 rounded-3xl"
        >
          {files.map((file, index) => {
            return (
              <Media
                disabled={disabled}
                type={file.type}
                url={file.blobUrl}
                key={index}
                onRemove={() => onRemoveFileFile(index)}
                containerClassName={
                  index === 0 && files.length % 2 === 1
                    ? "col-span-2"
                    : "col-span-1"
                }
                mediaClassName={
                  index === 0 && files.length % 2 === 1
                    ? "bg-contain"
                    : "bg-cover"
                }
              />
            );
          })}

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
                onRemoveFileFiles();
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
            }}
          >
            <X />
          </Button>
        </div>
      ) : (
        <div className="relative border h-[300px] rounded-xl border-dashed items-center justify-center flex flex-col py-4 gap-1">
          <Button
            disabled={disabled}
            className="absolute x -top-5 -right-5 rounded-full"
            type="button"
            variant={"secondary"}
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            <X />
          </Button>
          <Image size={60} />
          <h3 className=" text-white text-xl">Drag photo or video here</h3>
          <p className=" text-muted-foreground  text-sm ">SVG, PNG, JPG, MP4</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
