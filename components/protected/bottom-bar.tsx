"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobilePostButton from "./mobile-post-button";
import { Bell, Home, MessageSquareText, Search, Square } from "lucide-react";
import { useSearchModal } from "@/hooks/use-modal-store";

const Bottombar = () => {
  const pathName = usePathname();
  const { onOpen: openSearchModal } = useSearchModal();

  const bottombarLinks = [
    {
      icon: Home,
      type: "link",
      route: "/",
      label: "Home",
    },
    {
      icon: Search,
      type: "button",
      label: "Search",
      route: "",
      onclick: openSearchModal,
    },
  ];
  return (
    <div className=" border-t-[0.5px] bg-black border-gray-600 z-50 justify-evenly w-full flex sticky bottom-0  bg-dark-2 px-5 py-4 lg:hidden">
      {bottombarLinks.map((link) => {
        const isActive = pathName === link.route;
        return (
          <div key={`bottombar-${link.label}`}>
            {link.type === "link" ? (
              <Link
                href={link.route!}
                className={`${
                  isActive && "rounded-[10px] bg-background/25 "
                } flex items-center flex-col gap-1 p-2 transition`}
              >
                <link.icon />

                <p className="text-[10px] font-medium leading-[140%] text-white">
                  {link.label}
                </p>
              </Link>
            ) : (
              <button
                onClick={link.onclick}
                className={`${
                  isActive && "rounded-[10px] bg-background/25 "
                } flex items-center flex-col gap-1 p-2 transition`}
              >
                <link.icon />

                <p className="text-[10px] font-medium leading-[140%] text-white">
                  {link.label}
                </p>
              </button>
            )}
          </div>
        );
      })}
      <MobilePostButton />
    </div>
  );
};

export default Bottombar;
