"use client";
import { isTooLarge } from "@/lib/utils";
import { Image, Plus, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import { MediaFile } from "@/type";
import { videoMaxSize } from "@/constansts";
import { useFormContext } from "react-hook-form";
import MediaDisplayer from "./media-displayer";

type FileUploaderProps = {
  fieldChange: (files: MediaFile[]) => void;
  disabled: boolean;
};

const FileUploader = ({ fieldChange, disabled }: FileUploaderProps) => {
  const { setError } = useFormContext();
  const [files, setFiles] = useState<(MediaFile & { error: boolean })[]>([]);
  const { onCancel } = useIsAddingFiles();

  const handleSetFiles = (acceptedFiles: FileWithPath[]) => {
    if (files.length + acceptedFiles.length > 5) {
      return;
    }

    acceptedFiles.forEach((file) => {
      const type = file.type.includes("image") ? "image" : "video";

      const isFileTooLarge = isTooLarge(file, type);

      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          {
            url: reader.result,
            type: type,
            error: isFileTooLarge,
            size: file.size,
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

  const onRemoveFiles = () => {
    setFiles([]);
  };

  const onRemoveFile = (index: number) => {
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

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".MP4"],
    },
    onDropRejected: () => {
      setError("medias", {
        message:
          "Can only have 5 medias per post, images must be smaller than 8mb, videos must be smaller than 20mb",
      });
    },
    maxFiles: 5,
    maxSize: videoMaxSize,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <MediaDisplayer
          control
          medias={files}
          variant={"outline"}
          size={"outline"}
          onRemoveMedia={onRemoveFile}
          onRemoveAll={onRemoveFiles}
          disabled={disabled}
          onOpen={open}
          onCancel={onCancel}
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
