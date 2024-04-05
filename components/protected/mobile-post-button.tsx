"use client";
import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useNewMediaModal } from "@/hooks/use-modal-store";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobilePostButton = () => {
  const { onOpen } = useNewMediaModal();
  const pathName = usePathname();
  const matchRouteHandler = (string: string, words: string[]) =>
    words.some((word) => string.includes(word));

  const isMatchRoute = useMemo(() => {
    if (pathName === "/") return true;
    return !!matchRouteHandler(pathName, ["/profile"]);
  }, [pathName]);
  return (
    <div
      className={cn(
        "absolute -top-[90%] right-4 hidden",
        isMatchRoute && "block"
      )}
    >
      <Button
        variant={"blue"}
        size={"icon"}
        onClick={() => onOpen(null)}
        className="rounded-full w-[64px] h-[64px] lg:hidden"
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

export default MobilePostButton;
