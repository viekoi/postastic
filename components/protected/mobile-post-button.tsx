"use client";
import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useNewMediaModal } from "@/hooks/use-modal-store";

const MobilePostButton = () => {
  const { onOpen } = useNewMediaModal();

  return (
    <div className="absolute -top-[90%] right-4 ">
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
