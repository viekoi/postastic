import { isTooLarge } from "@/lib/utils";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { FileWithPath } from "react-dropzone";
import { UploadFile } from "@/type";

export const useFilesUploadActions = (
  files: UploadFile[],
  setFiles: Dispatch<SetStateAction<UploadFile[]>>
) => {
  const handleSetFiles = (acceptedFiles: FileWithPath[]) => {
    if (files.length + acceptedFiles.length > 5) return;
    acceptedFiles.forEach((file) => {
      const type = file.type.includes("image") ? "image" : "video";

      const isFileTooLarge = isTooLarge(file, type);

      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => {
          return [
            ...prev,
            {
              url: reader.result,
              type: type as "image" | "video",
              error: isFileTooLarge,
              size: file.size,
            },
          ];
        });
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
      const newFiles = [...prev].filter((file, fIndex) => {
        return fIndex !== index;
      });
      return newFiles;
    });
  };

  return {
    onDrop,
    files,
    onRemoveFile,
    onRemoveFiles,
  };
};
