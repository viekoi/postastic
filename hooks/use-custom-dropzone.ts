import { videoMaxSize } from "@/constansts";
import { isTooLarge } from "@/lib/utils";

import { useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useUploadFilesStore } from "./use-upload-files-store";

export const useCustomDropzone = () => {
  const { files, setFiles } = useUploadFilesStore();

  const handleSetFiles = (acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file) => {
      const type = file.type.includes("image") ? "image" : "video";

      const isFileTooLarge = isTooLarge(file, type);

      const reader = new FileReader();
      reader.onload = () => {
        const newFiles = [
          ...files,
          {
            url: reader.result,
            type: type as "image" | "video",
            error: isFileTooLarge,
            size: file.size,
          },
        ];
        setFiles(newFiles);
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

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".MP4"],
    },
    maxSize: videoMaxSize,
  });

  const onRemoveFiles = () => {
    setFiles([]);
  };

  const onRemoveFile = (index: number) => {
    const newFiles = [...files].filter((file, fIndex) => {
      return fIndex !== index;
    });
    setFiles(newFiles);
  };

  return {
    getRootProps,
    getInputProps,
    open,
    files,
    onRemoveFile,
    onRemoveFiles,
  };
};
