import { useCallback, useRef, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "../ui/button";
import { Image } from "lucide-react";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
};

const FileUploader = ({ fieldChange }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const filesRef = useRef<Set<File>>(new Set());

  const handleSetFiles = (acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file) => filesRef.current.add(file));

    setFiles(Array.from(filesRef.current));
    fieldChange(Array.from(filesRef.current));
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      handleSetFiles(acceptedFiles);
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/mp4": [".mp4", ".MP4"],
    },
    maxFiles: 10,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button type="button" variant={"ghost"} size={"icon"}>
        <Image />
      </Button>
    </div>
  );
};

export default FileUploader;
