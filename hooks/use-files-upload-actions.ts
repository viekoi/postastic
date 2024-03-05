import { isTooLarge } from "@/lib/utils";

import { useCallback } from "react";
import { FileWithPath } from "react-dropzone";
import { useUploadFilesStore } from "./use-upload-files-store";

export const useFilesUploadActions = () => {
  const { files, setFiles, addFile } = useUploadFilesStore();

  const handleSetFiles = (acceptedFiles: FileWithPath[]) => {
    if (files.length + acceptedFiles.length > 5) return;
    acceptedFiles.forEach((file) => {
      const type = file.type.includes("image") ? "image" : "video";

      const isFileTooLarge = isTooLarge(file, type);

      const reader = new FileReader();
      reader.onload = () => {
        addFile({
          url: reader.result,
          type: type as "image" | "video",
          error: isFileTooLarge,
          size: file.size,
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
    const newFiles = [...files].filter((file, fIndex) => {
      return fIndex !== index;
    });
    setFiles(newFiles);
  };

  return {
    onDrop,
    open,
    files,
    onRemoveFile,
    onRemoveFiles,
  };
};
