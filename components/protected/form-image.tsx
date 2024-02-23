"use client";
import { cn } from "@/lib/utils";

interface FormImageProps {
  url: string;
}

const FormImage = ({ url }: FormImageProps) => {
  return (
    <div
      className={cn(
        " col-span-1   p-1 overflow-hidden  border border-gray-600 "
      )}
    >
      <div
        className="pt-[50%] relative"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default FormImage;
