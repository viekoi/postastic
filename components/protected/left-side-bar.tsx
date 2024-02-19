"use client";
import Link from "next/link";
import { sidebarLinks } from "@/constansts";
import { Button } from "../ui/button";
import UserButton from "./user-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Twitter } from "lucide-react";

const LeftSidebar = () => {
  const pathName = usePathname();

  return (
    <div className="col-span-1 hidden lg:block sticky top-0  h-screen">
      <div className="w-full h-full flex">
        <div className="flex flex-col w-full h-full p-5">
          <div className="flex flex-col items-center space-y-4 h-full   ">
            <div className="flex flex-col space-y-4 w-full ">
              <Link className="group" href={"/"}>
                <Button variant={"link"}>
                  <Twitter fill={"white"} />
                </Button>
              </Link>
              {sidebarLinks.map((link) => {
                const isActive = pathName === link.route;

                return (
                  <Link className="group" href={link.route} key={link.route}>
                    <Button variant={"link"}>
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
                );
              })}
            </div>
            <Button variant={"blue"} className="rounded-full w-full">
              Post
            </Button>
          </div>

          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
