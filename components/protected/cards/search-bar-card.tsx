"use client";
import { Button } from "@/components/ui/button";
import { useSearchModal } from "@/hooks/use-modal-store";
import { Search } from "lucide-react";
import React from "react";

interface SearchBarCardProps {
  q: string;
}

const SearchBarCard = ({ q }: SearchBarCardProps) => {
  const { onOpen } = useSearchModal();
  return (
    <div
      className={
        "flex w-full  border-[3px] rounded-3xl  border-white justify-end  hover:opacity-60 hover:cursor-pointer overflow-hidden"
      }
      onClick={onOpen}
    >
      <input
        type="text"
        disabled
        value={q}
        className="bg-transparent flex-1 pl-4 hover:cursor-pointer pointer-events-none"
      />
      <Button
        variant={"postCard"}
        size={"icon"}
        type="submit"
        className="rounded-none"
      >
        <Search />
      </Button>
    </div>
  );
};

export default SearchBarCard;
