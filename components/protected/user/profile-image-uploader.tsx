"use cleint";

import Image from "next/image";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import UserAvatar from "./user-avatar";

import { UploadFile } from "@/type";

interface ImageUploadProps {
  fieldChange: (file: UploadFile | null) => void;
  label: string;
  value: UploadFile | null;
  disabled: boolean;
  type: "image" | "coverImage";
}

const ImageUpload = ({
  fieldChange,
  label,
  value,
  disabled,
  type,
}: ImageUploadProps) => {
  const [image, setImage] = useState<UploadFile | null>(value);
  const handleChange = useCallback(
    (file: UploadFile | null) => {
      fieldChange(file);
    },
    [fieldChange]
  );

  const handleDrop = useCallback(
    (files: FileWithPath[]) => {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const formatedFile = {
          url: reader.result as string,
          type:"image" as "image"
        };
        setImage(formatedFile);
        handleChange(formatedFile);
      };
      reader.readAsDataURL(file);
    },
    [handleChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  if (type === "image") {
    return (
      <div
        {...getRootProps({
          className:
            "w-full h-44 text-white text-center border-2 border-dotted rounded-md border-neutral-700",
        })}
      >
        <input {...getInputProps()} />

        <div className="w-full h-full flex items-center justify-center relative">
          <UserAvatar
            value={image ? (image.url as string) : ""}
            className="h-40 w-40"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps({
        className:
          "w-full h-44 text-white text-center border-2 border-dotted rounded-md border-neutral-700",
      })}
    >
      <input {...getInputProps()} />
      {image ? (
        <div className="w-full h-full flex items-center justify-center relative">
          <Image
            quality={100}
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
            src={image ? (image.url as string) : ""}
            alt="image"
            fill
            className={"bg-cover bg-no-repeat bg-center object-cover"}
          />
        </div>
      ) : (
        <p className="text-white h-full flex items-center justify-center">
          {label}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
