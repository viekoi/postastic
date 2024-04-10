"use client";
import Link from "next/link";

import { Button } from "../ui/button";
import UserButton from "./user/user-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Bell,
  Home,
  MessageSquareText,
  Search,
  Settings2,
  Twitter,
} from "lucide-react";
import { useNewMediaModal, useSearchModal } from "@/hooks/use-modal-store";
import { useCurrentUser } from "@/hooks/use-current-user";

const LeftSidebar = () => {
  const { onOpen: openSearchModal } = useSearchModal();
  const pathName = usePathname();
  const { onOpen } = useNewMediaModal();
  const { user } = useCurrentUser();

  const sidebarLinks = [
    {
      icon: Home,
      type: "link",
      route: "/",
      label: "Home",
    },
    {
      icon: Search,
      type: "button",
      route: "/search",
      label: "Search",
      onclick: openSearchModal,
    },
    {
      icon: Settings2,
      type: "link",
      route: "/settings",
      label: "Settings",
    },
  ];

  return (
    <div className="col-span-1 hidden lg:block sticky top-0  h-screen">
      <div className="w-full h-full flex">
        <div className="flex flex-col w-full h-full p-5">
          <div className="flex flex-col items-center space-y-4 h-full   ">
            <div className="flex flex-col space-y-4 w-full ">
              <Link className="group" href={"/"}>
                <Button variant={"ghost"} size={"link"}>
                  <Twitter fill={"white"} />
                </Button>
              </Link>
              {sidebarLinks.map((link) => {
                const isActive = pathName === link.route;

                return (
                  <div key={link.route}>
                    {link.type === "link" ? (
                      <Link
                        className="group"
                        href={link.route}
                       
                      >
                        <Button variant={"ghost"} size={"link"}>
                          <div
                            className={cn(
                              "relative",
                              isActive && "side-link-active"
                            )}
                          >
                            <link.icon />
                          </div>
                          {link.label}
                        </Button>
                      </Link>
                    ) : (
                      <div className="group">
                        <Button
                          variant={"ghost"}
                          size={"link"}
                          onClick={link.onclick}
                        >
                          <div
                            className={cn(
                              "relative",
                              isActive && "side-link-active"
                            )}
                          >
                            <link.icon />
                          </div>
                          {link.label}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Button
              onClick={() => onOpen(null)}
              variant={"blue"}
              className="rounded-full w-full"
            >
              Post
            </Button>
          </div>

          <UserButton user={user} />
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
