"use client";
import { convertFileToUrl } from "@/lib/utils";
import { Image } from "lucide-react";

import { useCallback, useRef, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import FormImage from "./form-image";

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
    maxFiles: 5,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <div className="grid grid-cols-2 justify-center ">
          {files.map((file, index) => {
            const url = convertFileToUrl(file);
            return <FormImage url={url} key={index} />;
          })}
        </div>
      ) : (
        <div className="border h-[300px] rounded-xl border-dashed items-center justify-center flex flex-col py-4 gap-1">
          <Image size={60} />
          <h3 className=" text-white text-xl">Drag photo here</h3>
          <p className=" text-muted-foreground  text-sm ">SVG, PNG, JPG, MP4</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
