"use client";
import { useSearchModal } from "@/hooks/use-modal-store";
import React, { useState } from "react";
import Modal from "./modal";
import SearchForm from "../forms/search/search-form";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/providers/is-mobile-provider";
import DrawerModal from "../drawers/drawer";

const SearchModal = () => {
  const { isOpen, onClose } = useSearchModal();
  const searchParams = useSearchParams();
  const { isMobile } = useIsMobile();
  const [searchValue, setSearchValue] = useState<string | null>(
    searchParams.get("q") ? searchParams.get("q") : ""
  );

  if (isMobile) {
    return (
      <DrawerModal className=" z-[1000]  " isOpen={isOpen} onClose={onClose}>
        <div className="overflow-x-hidden overflow-y-auto custom-scrollbar h-full">
          <SearchForm
            q={searchValue}
            setSearchValue={(value: string) => setSearchValue(value)}
          />
        </div>
      </DrawerModal>
    );
  }
  return (
    <Modal
      className="lg:max-h-[90vh]  lg:max-w-[600px]  z-[1000] "
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="overflow-x-hidden overflow-y-auto custom-scrollbar h-full ">
        <SearchForm
          q={searchValue}
          setSearchValue={(value: string) => setSearchValue(value)}
        />
      </div>
    </Modal>
  );
};

export default SearchModal;
