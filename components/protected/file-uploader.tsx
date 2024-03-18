"use client";
import { Image, X } from "lucide-react";

import { useEffect } from "react";
import { Button } from "../ui/button";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import { AttachmentFile } from "@/type";
import AttachmentDisplayer from "./attachment-displayer";
import { cn } from "@/lib/utils";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import { useFilesUploadActions } from "@/hooks/use-files-upload-actions";

type FileUploaderProps = {
  fieldChange: (files: AttachmentFile[]) => void;
  disabled: boolean;
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  open: () => void;
  isCommentFormChild?: boolean;
  className?: string;
  baseContainerClassName?: string;
  indexContainerClassName?: (index: number, dataLength: number) => string;
  baseAttachmentClassName?: string;
  indexAttachmentClassName?: (index: number, dataLength: number) => string;
};

const FileUploader = ({
  fieldChange,
  disabled,
  className,
  isCommentFormChild = false,
  getInputProps,
  getRootProps,
  open,
  baseContainerClassName,
  indexContainerClassName,
  baseAttachmentClassName: baseAttachmentClassName,
  indexAttachmentClassName,
}: FileUploaderProps) => {
  const { files } = useFilesUploadActions();

  const { onCancel } = useIsAddingFiles();

  useEffect(() => {
    fieldChange(files);
  }, [files]);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {files.length > 0 || isCommentFormChild ? (
        <AttachmentDisplayer
          open={open}
          className={cn("", className)}
          control={true}
          medias={files}
          variant={"outline"}
          size={"outline"}
          disabled={disabled}
          baseContainerClassName={baseContainerClassName}
          indexContainerClassName={indexContainerClassName}
          indexAttachmentClassName={indexAttachmentClassName}
          baseAttachmentClassName={baseAttachmentClassName}
        />
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
